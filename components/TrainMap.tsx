import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Base, Typography } from "../styles";
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Marker } from "react-native-maps";

import TrainModel from "../models/trains";

export default function TrainMap({ route, setDelays, delays, setTrains, trains, stations }) {
    const { reload } = route.params || false;
    const [locationMarker, setLocationMarker] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    if (reload) {
        reloadTrains();
    }

    async function reloadTrains() {
        setDelays(await TrainModel.getdelays());
        setTrains(await result);
    }

    useEffect(() => {
        reloadTrains();
    }, []);

    const result = delays
    .filter(delay => delay.hasOwnProperty( 'FromLocation' ))
    .map((item, index) => {
        let station = stations.filter(station => station.LocationSignature == item.FromLocation[0].LocationName).map((filteredstation) => {
            return filteredstation.AdvertisedLocationName;
        });
        let stationto = stations.filter(station => station.LocationSignature == item.ToLocation[0].LocationName).map((filteredstation) => {
            return filteredstation.AdvertisedLocationName;
        });
        let value = stations.filter(station => station.LocationSignature == item.FromLocation[0].LocationName).map((filteredstation) => {
            const regex = /(\d*\.\d+|\d+),?/g;
            const value = filteredstation.Geometry.WGS84.match(regex).map(coord => parseFloat(coord)).reverse();
            return value;
        });
        return {
            index: index,
            id: item.AdvertisedTrainIdent,
            lat: value[0],
            namn: station[0],
            till: stationto[0],
            oldmessage: new Date(item.AdvertisedTimeAtLocation).toLocaleString("se-SV"),
            message: new Date(item.EstimatedTimeAtLocation).toLocaleString("se-SV")
        }
        });

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
    
            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }
    
            const currentLocation = await Location.getCurrentPositionAsync({});
    
            setLocationMarker(<Marker
                coordinate={{
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                }}
                title="Din nuvarande position"
                pinColor="blue"
            />);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            setTrains(await result);
        })();
    }, []);

    return (
        <View style={Base.base}>
            <Text style={Typography.header}>Tågtrafik</Text>
            <Text style={Typography.header2}>Försenade tåg</Text>
            <Text style={Typography.normal}>Uppdatera kartan för att se förseningar tågtrafiken i appen.</Text>
            <Button
                title={"Uppdatera tågtrafiken"}
                key={1}
                onPress={() => {
                    reloadTrains()
                    }
                }
            />
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 56.1612,
                        longitude: 15.5869,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}>
                    {trains.map((report, i) => {
                        return (<Marker
                            key={report.index}
                            coordinate={{ latitude: report.lat[0], longitude: report.lat[1] }}
                            title={"Avgång: " + report.namn + " - " + report.till}
                            description={"Tåg nr: " + report.id + ". Ny tid: " + report.message}
                        />)
                    })}
                    {locationMarker}
                </MapView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
