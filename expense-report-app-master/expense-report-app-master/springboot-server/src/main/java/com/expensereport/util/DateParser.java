package com.expensereport.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

public final class DateParser {

    private static final DateTimeFormatter[] FORMATTERS = new DateTimeFormatter[] {
            DateTimeFormatter.ISO_LOCAL_DATE,
            DateTimeFormatter.ofPattern("d MMMM, yyyy", Locale.ENGLISH),
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("d-M-yyyy"),
            DateTimeFormatter.ofPattern("dd-MM-yyyy")
    };

    private DateParser() {
    }

    public static LocalDate parseRequired(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " is required. Please select a date.");
        }

        String trimmed = value.trim();
        for (DateTimeFormatter formatter : FORMATTERS) {
            try {
                return LocalDate.parse(trimmed, formatter);
            } catch (DateTimeParseException ignored) {
                // try next format
            }
        }

        throw new IllegalArgumentException(
                "Invalid date format. Please use the date picker or YYYY-MM-DD format.");
    }
}
