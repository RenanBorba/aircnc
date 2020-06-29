import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    margin: 30
  },

  label: {
    fontWeight: 'bold',
    color: '#444',
    marginTop: 30,
    marginBottom: 8
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#444',
    height: 44,
    marginBottom: 20,
    borderRadius: 2
  },

  button: {
    height: 42,
    backgroundColor: '#F05A5B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2
  },

  cancelButton: {
    backgroundColor: '#CCC',
    marginTop: 10
  },

  buttonText: {
    color:  '#FFF',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default styles;