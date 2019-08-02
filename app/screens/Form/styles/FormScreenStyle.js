import { StyleSheet, Dimensions } from 'react-native';

import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 25,
        margin: 5,
        color: COLOR_PALETTE.secondaryColor.S500,
        fontWeight: 'bold'
    },
    description: {
        textAlign: 'center',
        fontSize: 15,
        margin: 5
    },
    hint: {
        fontSize: 15,
        fontStyle: 'italic',
        margin: 5
    },
    buttonsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 5
    },
    imageWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 400,
        height: 200,
        borderRadius: 5
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