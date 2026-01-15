/**
 * Form Input Bileşenleri
 */

import { Text, TextInput, View, TouchableOpacity, Platform } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-foreground mb-2">
        {label}
        {required && <Text className="text-error"> *</Text>}
      </Text>
      {children}
      {error && <Text className="text-sm text-error mt-1">{error}</Text>}
    </View>
  );
}

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
}

export function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required,
  multiline,
  keyboardType = "default",
}: TextInputFieldProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        className={cn(
          "bg-surface border border-border rounded-xl px-4 py-3 text-foreground",
          multiline && "min-h-[80px] text-top"
        )}
        placeholderTextColor="#9BA1A6"
      />
    </FormField>
  );
}

interface DatePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  required?: boolean;
}

export function DatePickerField({
  label,
  value,
  onChange,
  error,
  required,
}: DatePickerFieldProps) {
  const [show, setShow] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <FormField label={label} error={error} required={required}>
      <TouchableOpacity
        onPress={() => setShow(true)}
        className="bg-surface border border-border rounded-xl px-4 py-3"
      >
        <Text className="text-foreground">{formatDate(value)}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_event: any, selectedDate?: Date) => {
            setShow(Platform.OS === "ios");
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}
    </FormField>
  );
}

interface PickerOption {
  label: string;
  value: string;
}

interface PickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: PickerOption[];
  error?: string;
  required?: boolean;
}

export function PickerField({
  label,
  value,
  onChange,
  options,
  error,
  required,
}: PickerFieldProps) {
  const [show, setShow] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <FormField label={label} error={error} required={required}>
      <TouchableOpacity
        onPress={() => setShow(!show)}
        className="bg-surface border border-border rounded-xl px-4 py-3"
      >
        <Text className="text-foreground">
          {selectedOption?.label || "Seçiniz"}
        </Text>
      </TouchableOpacity>

      {show && (
        <View className="bg-surface border border-border rounded-xl mt-2 overflow-hidden">
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setShow(false);
              }}
              className={cn(
                "px-4 py-3 border-b border-border",
                option.value === value && "bg-primary/10"
              )}
            >
              <Text
                className={cn(
                  "text-foreground",
                  option.value === value && "font-semibold"
                )}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </FormField>
  );
}

interface SwitchFieldProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  disabled?: boolean;
}

export function SwitchField({
  label,
  value,
  onChange,
  description,
  disabled = false,
}: SwitchFieldProps) {
  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => !disabled && onChange(!value)}
        className={cn(
          "flex-row items-center justify-between bg-surface border border-border rounded-xl px-4 py-3",
          disabled && "opacity-50"
        )}
        disabled={disabled}
      >
        <View className="flex-1">
          <Text className="text-base font-medium text-foreground">{label}</Text>
          {description && (
            <Text className="text-sm text-muted mt-1">{description}</Text>
          )}
        </View>
        <View
          className={cn(
            "w-12 h-7 rounded-full p-1",
            value ? "bg-primary" : "bg-border"
          )}
        >
          <View
            className={cn(
              "w-5 h-5 rounded-full bg-background",
              value && "ml-auto"
            )}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
