import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Base } from "./styles";
import Home from "./components/Home";
import HomeList from "./components/HomeList";
import trainModel from "./models/trains";

const Tab = createBottomTabNavigator();

const routeIcons = {
  "Karta": "map",
  "Lista": "list",
};

export default function App() {
  const [delays, setDelays] = useState([]);
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);

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

  useEffect(async () => {
    setDelays(await trainModel.getdelays());
    setStations(await trainModel.getstations());
    setTrains(await result);
}, []);
  return (
    <SafeAreaView style={Base.container}>
      <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = routeIcons[route.name] || "alert";

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'gray',
            headerShown: false
          })}
        >
            <Tab.Screen name="Karta">
            {(props) => <Home {...props} delays={delays} setDelays={setDelays} trains={trains} setTrains={setTrains} stations={stations} />}
          </Tab.Screen>
          <Tab.Screen name="Lista">
            {(props) => <HomeList {...props} trains={trains} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
