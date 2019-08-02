import { StyleSheet, Dimensions } from 'react-native';

import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        margin: 10,
    },
    firstDate: {
        width: Dimensions.get('window').width - 40,
    },
    secondDate: {
        width: Dimensions.get('window').width - 40,
        marginTop: 5,
    },
    dateInput: {
        borderRadius: 2,
    }
});

export default styles;