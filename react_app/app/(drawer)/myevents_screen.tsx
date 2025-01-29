import { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Button } from 'react-native-paper';
import api from "../api";
import { useSession } from "../context/auth_context";
import { useRouter } from "expo-router";
import AddEventModal from "../(screens)/add_event_screen";
import EventCard from "../(screens)/event_card";
// import { Button } from 'react-native-paper';

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

const MyEventsScreen: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isAddEventVisible, setAddEventVisible] = useState(false);
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
                const response = await api.get('/api/events/my_events');
                setEvents(response.data.events);
            } catch (error) {
                console.error('Error fetching user events:', error);
            }
        };

        fetchUserEvents();
    }, [refreshing]);

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <Button mode="contained" style={styles.addEventButton} onPress={() => setAddEventVisible(true)}>
                Add Event
            </Button>
            {events.length === 0 ? (
                <Text>No events available.</Text>
            ) : (
                events.map((event, index) => (
                    <EventCard 
                        key={index}
                        index={index} 
                        event={event} 
                        participateButton={false} 
                        modifyButton={true} 
                        refresh={onRefresh}>
                    </EventCard>
                ))
            )}
            {isAddEventVisible && <AddEventModal 
                onClose={() => setAddEventVisible(false)} 
                refresh={onRefresh}/>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    participantItem: {
        marginBottom: 10,
    },
    addEventButton: {
        marginBottom: 8,
        marginTop: 8,
        padding: 2,
    }
});

export default MyEventsScreen;
