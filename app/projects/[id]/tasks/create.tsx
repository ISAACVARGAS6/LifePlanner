import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "../../../../services/api";
import DynamicChibi, { ChibiEmotion } from "../../../../components/DynamicChibi";
import DatePicker from "../../../../components/DatePicker";
import { SakuraStyles } from "../../../../constants/Styles";
import { SakuraColors } from "../../../../constants/Colors";

export default function CreateTaskScreen() {
  const router = useRouter();
  const { id: projectId } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"baja" | "media" | "alta">("media");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [chibiEmotion, setChibiEmotion] = useState<ChibiEmotion>('neutral');
  const [showChibi, setShowChibi] = useState(false);

  const handleCreateTask = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "pendiente" as const,
        due_date: dueDate ? dueDate.toISOString() : null,
      };
      
      console.log('CreateTaskScreen: Enviando datos de tarea:', taskData);
      
      await api.tasks.create(Number(projectId), taskData);

      // Mostrar chibi de éxito
      setChibiEmotion('success');
      setShowChibi(true);
      setTimeout(() => setShowChibi(false), 3000);

      Alert.alert(
        "¡Éxito!",
        "Tarea creada correctamente",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('CreateTaskScreen: Error creando tarea:', error);
      Alert.alert("Error", "No se pudo crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = (newPriority: "baja" | "media" | "alta") => {
    setPriority(newPriority);
    
    // Mostrar chibi según la prioridad
    if (newPriority === 'alta') {
      setChibiEmotion('angry');
      setShowChibi(true);
      setTimeout(() => setShowChibi(false), 2000);
    } else if (newPriority === 'media') {
      setChibiEmotion('neutral');
      setShowChibi(true);
      setTimeout(() => setShowChibi(false), 2000);
    } else {
      setChibiEmotion('happy');
      setShowChibi(true);
      setTimeout(() => setShowChibi(false), 2000);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Nueva Tarea</Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.multilineInput]}
        multiline
      />

      <Text style={styles.sectionTitle}>Prioridad:</Text>
      <View style={styles.row}>
        {["baja", "media", "alta"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.optionButton,
              priority === level && styles.activeOptionButton,
            ]}
            onPress={() => handlePriorityChange(level as "baja" | "media" | "alta")}
          >
            <Text
              style={[
                styles.optionButtonText,
                priority === level && styles.activeOptionButtonText,
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <DatePicker
        value={dueDate}
        onChange={setDueDate}
        label="Fecha límite (opcional)"
        placeholder="Seleccionar fecha límite"
        minDate={new Date()}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.purpleButton, loading && styles.disabledButton]}
          onPress={handleCreateTask}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creando..." : "Crear Tarea"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chibi flotante */}
      {showChibi && (
        <View style={styles.chibiContainer}>
          <DynamicChibi 
            emotion={chibiEmotion} 
            size="medium"
            showMessage={true}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    color: "#c4b5fd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f2f2f7",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#c4b5fd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f2f2f7",
  },
  activeOptionButton: {
    backgroundColor: "#c4b5fd",
    borderColor: "#c4b5fd",
  },
  optionButtonText: {
    color: "#333",
    textTransform: "capitalize",
  },
  activeOptionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  purpleButton: {
    backgroundColor: "#c4b5fd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  chibiContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
});
