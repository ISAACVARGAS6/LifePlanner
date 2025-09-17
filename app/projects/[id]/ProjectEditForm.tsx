import React, { useState } from 'react';
import { View, StyleSheet, Button as RNButton, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Project {
  id: number;
  title: string;
  description: string;
  priority: string;
  category: string;
  deadline: string;
  status: string;
}

interface ProjectEditFormProps {
  project: Project;
  onProjectUpdated: () => void;
  onClose: () => void;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function ProjectEditForm({
  project,
  onProjectUpdated,
  onClose,
}: ProjectEditFormProps) {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [priority, setPriority] = useState(project.priority);
  const [category, setCategory] = useState(project.category);
  const [deadline, setDeadline] = useState(new Date(project.deadline));
  const [status, setStatus] = useState(project.status);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/lifeplanner/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          priority,
          category,
          deadline: deadline.toISOString(),
          status,
        }),
      });
      if (response.ok) {
        onProjectUpdated();
        onClose();
      } else {
        console.error('Error al actualizar el proyecto');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput label="Título" value={title} onChangeText={setTitle} />
      <TextInput label="Descripción" value={description} onChangeText={setDescription} multiline />
      <TextInput label="Categoría" value={category} onChangeText={setCategory} />
      <TextInput label="Prioridad" value={priority} onChangeText={setPriority} />
      <TextInput label="Estado" value={status} onChangeText={setStatus} />

      <Button onPress={() => setShowDatePicker(true)}>
        Fecha límite: {deadline.toLocaleDateString()}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios'); // iOS keeps picker open
            if (selectedDate) setDeadline(selectedDate);
          }}
        />
      )}

      <Button mode="contained" onPress={handleSave} loading={loading} style={styles.saveButton}>
        Guardar cambios
      </Button>
      <RNButton title="Cancelar" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  saveButton: { marginTop: 16 },
});
