import { StyleSheet, Dimensions } from 'react-native';

import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        margin: 5,
    },
    rowContainer: {
        padding: 5,
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: COLOR_PALETTE.white,
        borderColor: COLOR_PALETTE.gray,
        borderWidth: 1,
        borderRadius: 2,
    },
    indexText: {
        flex: 1,
        textAlign: 'left',
        fontSize: 18,
        color: COLOR_PALETTE.primaryColor.P500,
    },
    mandatoryText: {
        flex: 1,
        textAlign: 'right',
        fontSize: 18,
        color: COLOR_PALETTE.secondaryColor.S500,
        fontWeight: 'bold',
    },
    nameText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR_PALETTE.primaryColor.P500,
        marginBottom: 5,
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'center',
        color: COLOR_PALETTE.primaryColor.P300,
    },
});

export default styles;