import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    padding: 30,
  },
  registerText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
  },
});
