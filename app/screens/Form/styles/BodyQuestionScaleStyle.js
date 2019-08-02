import { StyleSheet, Dimensions } from 'react-native';

import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    columnContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    labelsContainer: {
        width: Dimensions.get('window').width - 10,
        marginHorizontal: 10,
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    labelWrapper: {
        flex: 1,
        marginHorizontal: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    image: {
        width: (Dimensions.get('window').width / 5) - 10,
        height: 100,
    },
    label: {
        textAlign: 'center',
    },
    tickContainer: {
        width: Dimensions.get('window').width - 10,
        marginHorizontal: 10,
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    tick: {
        flex: 1,
        marginHorizontal: 5,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: COLOR_PALETTE.primaryColor.P500,
    },
    tickLabel: {
        color: COLOR_PALETTE.primaryColor.P500,
        textAlign: 'center',
    },
    gradient: {
        top: 10,
        opacity: 0.5,
        width: Dimensions.get('window').width - 40,
        height: 50,
    },
    slider: {
        width: Dimensions.get('window').width / 1.5,
        marginHorizontal: 10,
        transform: [{scaleX: 1.5 }, { scaleY: 1.5 }],
        justifyContent: 'center',
    },
    selectedValue: {
        textAlign: 'center',
    },
});

export default styles;