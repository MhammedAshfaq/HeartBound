declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
}

declare module 'react-native-calendar-picker' {
  import { Component } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';

  interface CalendarPickerProps {
    initialDate?: Date;
    initialView?: 'days' | 'months' | 'years';
    onDateChange?: (date: Date, type: string) => void;
    selectedStartDate?: Date;
    selectedEndDate?: Date;
    minDate?: Date;
    maxDate?: Date;
    textStyle?: TextStyle;
    monthTitleStyle?: TextStyle;
    yearTitleStyle?: TextStyle;
    previousTitle?: string;
    nextTitle?: string;
    previousTitleStyle?: TextStyle;
    nextTitleStyle?: TextStyle;
    previousComponent?: React.ReactNode;
    nextComponent?: React.ReactNode;
    selectedDayColor?: string;
    selectedDayTextColor?: string;
    todayBackgroundColor?: string;
    todayTextStyle?: TextStyle;
    dayShape?: 'circle' | 'square';
    width?: number;
    height?: number;
    scaleFactor?: number;
    startFromMonday?: boolean;
    firstDay?: number;
    weekdays?: string[];
    months?: string[];
    headingLevel?: number;
    selectMonthTitle?: string;
    selectYearTitle?: string;
    restrictMonthNavigation?: boolean;
    enableDateChange?: boolean;
    disabledDates?: Date[] | ((date: Date) => boolean);
    customDatesStyles?: Array<{ date: Date; style: ViewStyle; textStyle: TextStyle }>;
    allowRangeSelection?: boolean;
    allowBackwardRangeSelect?: boolean;
    showDayStragglers?: boolean;
    dayLabelsWrapper?: ViewStyle;
    monthYearHeaderWrapperStyle?: ViewStyle;
    headerWrapperStyle?: ViewStyle;
    onMonthChange?: (date: Date) => void;
  }

  export default class CalendarPicker extends Component<CalendarPickerProps> {}
}
