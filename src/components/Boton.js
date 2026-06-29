import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/globalStyles';

export default function Boton({ title, onPress, type = 'primary', style, disabled }) {
  const backgroundColor = disabled ? '#cccccc' :
                          type === 'primary' ? colors.primary :
                          type === 'danger' ? colors.danger : colors.secondary;
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }, style]} onPress={onPress} disabled={disabled}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});