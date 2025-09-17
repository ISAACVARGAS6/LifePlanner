import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { SakuraColors } from '../constants/Colors';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export default function DatePicker({
  value,
  onChange,
  label = "Fecha límite",
  placeholder = "Seleccionar fecha",
  minDate,
  maxDate,
  disabled = false,
}: DatePickerProps) {
  const [visible, setVisible] = useState(false);

  const handleConfirm = ({ date }: { date: Date }) => {
    onChange(date);
    setVisible(false);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Button
        mode="outlined"
        onPress={() => setVisible(true)}
        disabled={disabled}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        {value ? formatDate(value) : placeholder}
      </Button>
      
      {value && (
        <Button
          mode="text"
          onPress={handleClear}
          style={styles.clearButton}
          textColor={SakuraColors.error}
        >
          Limpiar fecha
        </Button>
      )}

      <DatePickerModal
        locale="es"
        mode="single"
        visible={visible}
        onDismiss={handleDismiss}
        date={value}
        onConfirm={handleConfirm}
        saveLabel="Confirmar"
        dismissLabel="Cancelar"
        label="Seleccionar fecha"
        animationType="slide"
        presentationStyle="pageSheet"
        startYear={2020}
        endYear={2030}
        validRange={{
          disabledDates: undefined,
          startDate: minDate,
          endDate: maxDate,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: SakuraColors.textPrimary,
    marginBottom: 8,
  },
  button: {
    borderRadius: 8,
    borderColor: SakuraColors.border,
    backgroundColor: SakuraColors.surface,
  },
  buttonContent: {
    height: 48,
  },
  clearButton: {
    marginTop: 8,
    borderRadius: 8,
  },
}); 