import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TrainList from './TrainList';

const Stack = createNativeStackNavigator();

export default function HomeList(props) {
    return (
        <Stack.Navigator initialRouteName="List">
            <Stack.Screen name="Lista">
                {(screenProps) => <TrainList {...screenProps} trains={props.trains}/>}
            </Stack.Screen>
        </Stack.Navigator>
    );
}