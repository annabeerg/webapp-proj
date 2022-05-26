import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TrainMap from './TrainMap';

const Stack = createNativeStackNavigator();

export default function Home(props) {
    return (
        <Stack.Navigator initialRouteName="List">
            <Stack.Screen name="Karta">
                {(screenProps) => <TrainMap {...screenProps} setDelays={props.setDelays} delays={props.delays} setTrains={props.setTrains} trains={props.trains} stations={props.stations}/>}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
