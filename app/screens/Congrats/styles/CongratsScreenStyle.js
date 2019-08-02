import { StyleSheet, Dimensions } from 'react-native';

import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 16,
        margin: 15,
    },
    buttonsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 10,
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