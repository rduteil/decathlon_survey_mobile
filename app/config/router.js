import { StackNavigator } from 'react-navigation';

import ExplorerScreen from '../screens/Explorer/ExplorerScreen';
import FormScreen from '../screens/Form/FormScreen';
import CongratsScreen from '../screens/Congrats/CongratsScreen'; 

import { COLOR_PALETTE } from './theme';

export default StackNavigator({
        ExplorerScreen: { screen: ExplorerScreen },
        FormScreen: { screen: FormScreen },
        CongratsScreen: { screen: CongratsScreen }
    },
    {
        initialRouteName: 'ExplorerScreen',
        navigationOptions: {
            headerStyle: {
                backgroundColor: COLOR_PALETTE.primaryColor.P500,
            },
            headerTintColor: COLOR_PALETTE.white,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);