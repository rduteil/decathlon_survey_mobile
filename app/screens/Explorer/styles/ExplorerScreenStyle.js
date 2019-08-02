import { StyleSheet, Dimensions } from "react-native";
import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    windowContainer: {
        width: '100%',
        height: '100%',  
    },
    columnContainer: {
        display: 'flex',
        flexDirection: 'column',
        margin: 5,
        alignItems: 'stretch',
    },
    cardContainer: {
        flex: 1,
    },
    toastContainer: {
        maxWidth: Dimensions.get('window').width - 50,
    },
    toastText: {
        textAlign: 'center',
        color: COLOR_PALETTE.white,
    },
});

export default styles;