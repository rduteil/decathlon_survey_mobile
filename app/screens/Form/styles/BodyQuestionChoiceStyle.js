import { StyleSheet, Dimensions } from 'react-native';

import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    columnContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        paddingVertical: 5,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    tableRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    tableCell: {
        width: 170,
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
        borderWidth: 1,
        borderColor: COLOR_PALETTE.gray,
        borderRadius: 2,
    },
    hint: {
        fontStyle: 'italic',
    },
    image: {
        width: 100,
        height: 100,
        marginLeft: 5,
        borderRadius: 2,
    },
    text: {
        flex: 1,
        marginLeft: 5,
    },
    placeholder: {
        flex: 1,
        marginLeft: 5,
        color: COLOR_PALETTE.gray,
    },
    answerWrapper: {
        margin: 5,
        padding: 5,
        backgroundColor: COLOR_PALETTE.white,
        borderRadius: 2,
    },
});

export default styles;