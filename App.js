import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { TextInputMask } from "react-native-masked-text";
import axios from "axios";

export default function App() {
  const [body, setBody] = React.useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
  });

  const handlerChange = ({ target }, name) => {
    const { value } = target;
    const obj = {
      ...body,
      [name]: value,
    };
    setBody(obj);
  };
  const handlerChangeDate = (date) => {
    const obj = {
      ...body,
      fechaNacimiento: date,
    };
    setBody(obj);
  };

  const handlerRegistrar = async () => {
    try {
      
      const { nombre, apellido, fechaNacimiento } = body;
      console.log(nombre, apellido, fechaNacimiento);
      if (nombre == "" || apellido == "" || fechaNacimiento == "") {
        Alert.alert("Necesita llenar todos los campos.");
        return;
      }

      const [year, month, day] = fechaNacimiento.split("-");

      if (parseInt(year) < 1900 || parseInt(year) > 2022) {
        Alert.alert("Rango años esta permitida son entre 1900 y 2022");
        return;
      }

      if (parseInt(month) <= 0 || parseInt(month) > 12) {
        Alert.alert("Rango mes esta permitida son entre 1 y 12");
        return;
      }

      if (parseInt(day) <= 0 || parseInt(day) > 30) {
        Alert.alert("Rango mes esta permitida son entre 1 y 30");
        return;
      } 

      const { data , status} = await axios.post("https://backend-node-mdp.herokuapp.com/api/cliente",body);

      if( status == 200 ){
        const { message } = data;
        Alert.alert(message);
        setBody({
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nombre de cliente</Text>
      <TextInput
        style={styles.input}
        value={body.nombre}
        onChange={(event) => handlerChange(event, "nombre")}
      />
      <Text>Apellido</Text>
      <TextInput
        name="apellido"
        style={styles.input}
        value={body.apellido}
        onChange={(event) => handlerChange(event, "apellido")}
      />
      <Text>Fecha de nacimiento</Text>
      <TextInputMask
        type={"datetime"}
        style={styles.input}
        options={{
          format: "YYYY-MM-DD",
        }}
        placeholder="YYYY-MM-DD"
        value={body.fechaNacimiento}
        onChangeText={(text) => handlerChangeDate(text)}
      />

      <Button title="Agregar Cliente" onPress={handlerRegistrar} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});