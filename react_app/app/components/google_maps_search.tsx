import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import config from "../config";
import { useController, Control, UseFormSetValue } from "react-hook-form";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";


interface SubmittedEvent {
    name: string;
    description: string;
    date: string;
    latitude: string;
    longitude: string;
    address: string;
}

interface GooglePlacesInputProps {
    control: Control<SubmittedEvent, any>;
    setValue: UseFormSetValue<SubmittedEvent>;
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({ control, setValue }) => {
    const { field } = useController({
        control,
        name: "address",
        rules: { required: "You must enter the address" },
    });

    return (
        <ScrollView
            horizontal={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ flexGrow: 1 }}
            style={styles.container}
        >
            <GooglePlacesAutocomplete
                placeholder="Enter address"
                fetchDetails={true}
                onPress={(data, details = null) => {
                    if (details) {
                        const { lat, lng } = details.geometry.location;
                        console.log("Latitude:", lat, "Longitude:", lng);
                        setValue("latitude", lat.toString());
                        setValue("longitude", lng.toString());
                    }
                    field.onChange(data.description);
                }}
                query={{
                    key: config.google_api_key,
                    language: "pl",
                }}
                styles={{
                    textInput: styles.input,
                }}
                textInputProps={{
                    value: field.value,
                    onChangeText: field.onChange,
                }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10
    },
});

export default GooglePlacesInput;
