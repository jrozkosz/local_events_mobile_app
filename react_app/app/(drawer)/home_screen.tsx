import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { TextInput } from 'react-native-paper';
import api from "../api";
import { useSession } from "../context/auth_context";
import { useRouter } from "expo-router";
import AddEventModal from "../(screens)/add_event_screen";
import EventCard from "../(screens)/event_card";
import { Ionicons } from "@expo/vector-icons";
// import { Button } from "react-native-paper";

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

const HomeScreen: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isAddEventVisible, setAddEventVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 1000);
    };

    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                const response = await api.get('/api/events/all_events');
                setEvents(response.data.events);
            } catch (error) {
                console.error('Error fetching user events:', error);
            }
        };

        fetchUserEvents();
    }, [refreshing]);

    const filterdEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.searchingRow}>
                <Ionicons name="search-circle-outline" style={styles.searchIcon}></Ionicons>
                <TextInput
                    style={styles.searchInput}
                    // mode="outlined"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                >
                </TextInput>
            </View>
            {filterdEvents.length === 0 ? (
                <Text>No events available.</Text>
            ) : (
                filterdEvents.map((event, index) => (
                    <EventCard 
                        key={index}
                        index={index} 
                        event={event} 
                        participateButton={true} 
                        modifyButton={false} 
                        refresh={onRefresh}>
                    </EventCard>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    searchingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 2,
      borderRadius: 8,
      borderColor: '#6750A4',
      backgroundColor: "#f9f9f9",
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 16,
      borderWidth: 0,
      backgroundColor: "transparent",
    },
    searchIcon: {
      fontSize: 30,
      marginRight: 10,
      color: '#6750A4',
    },
    noEventsText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: 16,
      color: "#888",
    },
});
  

export default HomeScreen;
