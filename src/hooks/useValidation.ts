"use client";

import { useCallback, useState } from "react";

export function useValidation<TValues extends Record<string, unknown>>(
  initial: TValues,
  validate: (values: TValues) => Partial<Record<keyof TValues, string>>
) {
  const [values, setValues] = useState<TValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof TValues, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof TValues, boolean>>>({});

  const setValue = useCallback(
    <K extends keyof TValues>(key: K, value: TValues[K]) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        if (touched[key]) {
          setErrors(validate(next));
        }
        return next;
      });
    },
    [touched, validate]
  );

  const handleBlur = useCallback(
    <K extends keyof TValues>(key: K) => {
      setTouched((t) => ({ ...t, [key]: true }));
      setErrors(validate(values));
    },
    [values, validate]
  );

  const validateAll = useCallback(() => {
    const e = validate(values);
    setErrors(e);
    setTouched(
      Object.keys(values).reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {} as Partial<Record<keyof TValues, boolean>>
      )
    );
    return Object.keys(e).length === 0;
  }, [values, validate]);

  const reset = useCallback(
    (next?: TValues) => {
      setValues(next ?? initial);
      setErrors({});
      setTouched({});
    },
    [initial]
  );

  return { values, errors, touched, setValue, handleBlur, validateAll, reset, setValues };
}
