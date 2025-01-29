import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking, Modal, ImageBackground, Image } from "react-native";
import { Button} from 'react-native-paper';
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import api from "../api";
import { useSession } from "../context/auth_context";

type Event = {
  id: number;
  created_by: string;
  name: string;
  description: string;
  date: string;
  address: string;
  latitude: number;
  longitude: number;
  participants: string[];
}

interface EventCardProps {
  index: number;
  event: Event;
  participateButton: boolean;
  modifyButton: boolean;
  refresh: () => void;
}

const MAX_DESCRIPTION_LENGTH: number = 50;
const MAX_LINES = 3;

const EventCard: React.FC<EventCardProps> = ({index, event, participateButton, modifyButton, refresh}) => {
  const [isParticipantsLookupVisible, setParticipantsLookupVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [eventParticipants, setEventParticipants] = useState<string[]>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { username } = useSession();
  

  const openMap = (latitude: number, longitude: number) => {
    console.log(longitude, latitude);
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch((err) =>
        console.error("Error opening Google Maps: ", err)
    )
  }

  const handleParticipantsDisplay = (event: Event) => {
    setSelectedEvent(event);
    setEventParticipants(event.participants);
    setParticipantsLookupVisible(true);
  }

  const handleCloseParticipantsModal = () => {
    setParticipantsLookupVisible(false);
  }

  const handleAddParticipation = async (event_id: number) => {
    try {
      const response = await api.post("/api/events/add_participation", { event_id })
      Alert.alert("Success", "Successfully added participation!");
      refresh();
    } catch (error) {
      console.error("Error adding a participation.", error);
      Alert.alert("Error", "Failed to add participation.");
    }
  }

  const handleRemoveParticipation = async (event_id: number, participantToRemove: string) => {
    try {
      const response = await api.post("/api/events/remove_participation", {event_id, participantToRemove});
      Alert.alert("Success", "Successfully removed participation!");
      refresh();
      setEventParticipants(prevParticipants =>
        prevParticipants.filter(participant => participant !== participantToRemove)
      );
    } catch (error) {
      console.error("Error removing a participation.", error);
      Alert.alert("Error", "Failed to remove participation.");
    }
  }

  const handleDescriptionExpand = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  }

  return (
    <ScrollView style={styles.container}>
      <View key={index} style={[styles.eventCard, {backgroundColor: new Date(event.date) > new Date() ? 'white' : '#FFEBEB'}]}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text
          style={styles.eventDescription}
          numberOfLines={isDescriptionExpanded ? undefined : MAX_LINES}
          ellipsizeMode="tail"
        >
          {event.description}
        </Text>
        {event.description.split("\n").length > MAX_LINES && (
          <TouchableOpacity style={styles.showMoreButton} onPress={handleDescriptionExpand}>
            <Text style={styles.eventButtonText}>
              {isDescriptionExpanded ? "Show less" : "Show more"}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={styles.eventDate}>{new Date(event.date).toLocaleString()}</Text>
        <TouchableOpacity onPress={() => openMap(event.latitude, event.longitude)}>
            <Text style={styles.eventLocation}>Location: {event.address}</Text>
        </TouchableOpacity>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.touchable} onPress={() => handleParticipantsDisplay(event)}> 
          <View style={styles.test}>
                <Text style={styles.participationButtonText}>View Participants ({event.participants.length})</Text>
              </View> 
            <ImageBackground   
              source={require('../assets/images/persons.png')} 
              // style={styles.imageStyle}
              style={styles.participationButton}
            > 
            </ImageBackground>  
          </TouchableOpacity>

          {(participateButton && !event.participants.includes(String(username))) ? (
            <TouchableOpacity onPress={() => handleAddParticipation(event.id)} style={styles.participButton}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
              <Text>Participate</Text>
            </TouchableOpacity>
          ) : (
            <Ionicons 
              name="checkmark-circle-outline" 
              size={25} 
              color="green" 
              style={{ textShadowColor: 'black', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }} 
            />
          )}
        </View>
      </View>

      <Modal
        visible={isParticipantsLookupVisible}
        onRequestClose={handleCloseParticipantsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Participants</Text>
            <ScrollView>
              {selectedEvent && eventParticipants.map((participant, index) => (
                <View key={index} style={styles.participantItem}>
                  <Text style={styles.participateButtonText}>{participant}</Text>
                  {(participant === username && participant !== selectedEvent.created_by) && (
                    <TouchableOpacity onPress={() => handleRemoveParticipation(selectedEvent.id, participant)}>
                      <Text style={{fontStyle: 'italic'}}>Cancel participation</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
            <Button onPress={handleCloseParticipantsModal}>Close</Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
    backgroundColor: '#f7f7f7'
  },
  eventCard: {
    marginBottom: 9,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 15,
    marginBottom: 10,
    color: '#444',
    lineHeight: 22
  },
  eventDate: {
    color: '#777',
    fontSize: 14,
  },
  eventLocation: {
    color: '#007bff',
    fontSize: 14,
    marginTop: 5,
  },
  showMoreButton: {
    marginTop: -10,
    alignSelf: 'flex-start',
    marginBottom: 10

  },
  eventButtonText: {
    color: '#007bff',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  participButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#DCD3F6',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  participationButton: {
    flexDirection: 'row',
    alignItems: "baseline",
    padding: 12,
    borderRadius: 5,
    width: 185,
    height: 25,
    opacity: 0.8
  },
  test: {
    opacity: 1.0,
    backgroundColor: 'white'
  },
  touchable: {
    borderRadius: 1,
    borderWidth: 2,
    borderColor: '#6750A4'
  },
  participationButtonText: {
    color: '#6750A4',
    fontSize: 16,
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: 475,
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  participateButtonText: {
    fontSize: 16,
  },
});

export default EventCard;
