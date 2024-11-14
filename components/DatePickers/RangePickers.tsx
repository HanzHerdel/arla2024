import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { TimePickerModal, DatePickerModal } from "react-native-paper-dates";
import { es, registerTranslation } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

registerTranslation("es", { ...es });

export interface TiempoPicker {
  hours: number;
  minutes: number;
}
interface RangePickersProps {
  fechaInicio: CalendarDate;
  setFechaInicio: (date: Date) => void;
  fechaFin: CalendarDate;
  setFechaFin: (date: Date) => void;
  setHorasInicio: (tiempoPicker: TiempoPicker) => void;
  setHorasFin: (tiempoPicker: TiempoPicker) => void;
  horaInicio: TiempoPicker;
  horaFin: TiempoPicker;
}

const RangePickers: React.FC<RangePickersProps> = ({
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
  setHorasInicio,
  setHorasFin,
  horaFin,
  horaInicio,
}) => {
  const [timeInitVisible, setTimeInitVisible] = useState(false);

  const [timeEndVisible, setTimeEndVisible] = useState(false);
  const [openDates, setOpenDates] = useState(false);
  const onDismissTimeInit = () => {
    setTimeInitVisible(false);
  };

  const onDismissTimeEnd = () => {
    setTimeEndVisible(false);
  };

  const onConfirmTimeInit = ({ hours, minutes }: TiempoPicker) => {
    setTimeInitVisible(false);
    console.log({ hours, minutes });
    setHorasInicio({ hours, minutes });
  };

  const onConfirmTimeEnd = ({ hours, minutes }: TiempoPicker) => {
    setTimeEndVisible(false);
    console.log({ hours, minutes });
    setHorasFin({ hours, minutes });
  };

  const onDismissDate = () => {
    setOpenDates(false);
  };

  const onConfirmDate = ({
    startDate,
    endDate,
  }: {
    startDate: CalendarDate;
    endDate: CalendarDate;
  }) => {
    if (!startDate || !endDate) {
      console.log("error: necesita seleccionar el rango de fechas");
      return;
    }
    setOpenDates(false);
    setFechaInicio(startDate as Date);
    setFechaFin(endDate as Date);
  };

  return (
    <View style={styles.container}>
      <Button
        style={styles.buttons}
        onPress={() => setOpenDates(true)}
        uppercase={false}
        mode="outlined"
      >
        Rango: {fechaInicio?.toLocaleDateString()} -{" "}
        {fechaFin?.toLocaleDateString()}
      </Button>
      <DatePickerModal
        locale="es"
        mode="range"
        visible={openDates}
        onDismiss={onDismissDate}
        startDate={fechaInicio}
        endDate={fechaFin}
        onConfirm={onConfirmDate}
      />
      <Button
        style={styles.buttons}
        onPress={() => setTimeInitVisible(true)}
        uppercase={false}
        mode="outlined"
      >
        Hora Inicial {horaInicio.hours}:{horaInicio.minutes}
      </Button>
      <TimePickerModal
        locale="es"
        visible={timeInitVisible}
        onDismiss={onDismissTimeInit}
        onConfirm={onConfirmTimeInit}
        hours={horaInicio.hours}
        minutes={horaInicio.minutes}
      />
      <Button
        style={styles.buttons}
        onPress={() => setTimeEndVisible(true)}
        uppercase={false}
        mode="outlined"
      >
        Hora Final {horaFin.hours}:{horaFin.minutes}
      </Button>
      <TimePickerModal
        locale="es"
        visible={timeEndVisible}
        onDismiss={onDismissTimeEnd}
        onConfirm={onConfirmTimeEnd}
        hours={horaFin.hours}
        minutes={horaFin.minutes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  buttons: {
    margin: 12,
  },
});

export default RangePickers;
