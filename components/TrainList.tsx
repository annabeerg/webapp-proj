import { View, Text, ScrollView } from "react-native";
import { Base, Typography } from "../styles";

export default function TrainList({trains}) {

    const trainsList =trains.map((item, index) => {
        return <View>
            <Text
                key={index} style={Typography.header4}
                >
                    {item.namn} - {item.till}
            </Text>
            <Text
                key={index} style={Typography.normal}
                >
                    Tåg nummer: {item.id} {'\n'}
                    Tid: {item.oldmessage} {'\n'}
                    Ändrad tid, avgår: {item.message}
            </Text>
            </View>;
    });

    return (
        <ScrollView style={Base.base}>
            <Text style={Typography.header}>Tågtrafik</Text>
            <Text style={Typography.header2}>Försenade tåg</Text>
            {trainsList}
        </ScrollView>
    );
};
