import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import api from "../api";
import GooglePlacesInput from "../components/google_maps_search";

interface AddEventModalProps {
    onClose: () => void;
    refresh: () => void;
}

interface SubmittedEvent {
    name: string;
    description: string;
    date: string;
    latitude: string;
    longitude: string;
    address: string;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, refresh }) => {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<SubmittedEvent>();
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    const handleAddEvent = async (data: SubmittedEvent) => {
        try {
            await api.post("/api/events/add_event", data);
            Alert.alert("Success", "Event published successfully!");
            onClose();
            refresh();
        } catch (error) {
            console.error("Error uploading an event.", error);
            Alert.alert("Error", "Failed to upload event.");
        }
    };

    return (
        <Modal transparent={true} animationType="slide" visible={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: "You must enter the event name" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Event Name"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                style={styles.input}
                            />
                        )}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                    <Controller
                        control={control}
                        name="description"
                        rules={{ required: "You must enter the description" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                label="Event Description"
                                value={value}
                                onChangeText={onChange}
                                mode="outlined"
                                multiline
                                style={styles.input}
                            />
                        )}
                    />
                    {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

                    <Controller
                        control={control}
                        name="date"
                        rules={{ required: "You must enter the date" }}
                        render={({ field: { value } }) => (
                            <>
                                <Button onPress={() => setDatePickerVisible(true)} mode="outlined" style={{width: "100%"}}>
                                    {value ? new Date(value).toLocaleString() : "Select Date"}
                                </Button>
                                <DateTimePickerModal
                                    isVisible={datePickerVisible}
                                    mode="datetime"
                                    onConfirm={(date: Date) => {
                                        setValue("date", date.toISOString());
                                        setDatePickerVisible(false);
                                    }}
                                    onCancel={() => setDatePickerVisible(false)}
                                />
                            </>
                        )}
                    />
                    {errors.date && <Text style={styles.errorText}>{errors.date.message}</Text>}

                    <GooglePlacesInput control={control} setValue={setValue} ></GooglePlacesInput>
                    {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

                    <Button mode="contained" style={{marginTop: 40, marginBottom: 10, width: "50%"}} onPress={handleSubmit(handleAddEvent)}>
                        Add Event
                    </Button>
                    <Button mode="outlined" style={{marginBottom: 5, width: "50%"}} onPress={onClose}>
                        Cancel
                    </Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "90%",
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    input: {
        width: "100%",
        marginBottom: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
});

export default AddEventModal;
