import { useCallback, useEffect, useMemo, useState } from 'react';

export function useDropdown({
  options,
  value,
  onChange,
  disabled,
  containerRef
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;

    setIsOpen((prevState) => !prevState);
  }, [disabled]);

  const handleOptionClick = useCallback(
    (optionValue) => {
      if (onChange) {
        onChange(optionValue);
      }

      closeDropdown();
    },
    [closeDropdown, onChange]
  );

  const handleOptionSelect = useCallback(
    (optionValue) => {
      handleOptionClick(optionValue);
    },
    [handleOptionClick]
  );

  const handleClearClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled || !onChange) return;

      onChange(null);
      closeDropdown();
    },
    [closeDropdown, disabled, onChange]
  );

  useEffect(() => {
    if (!isOpen) return;

    const onDocumentClick = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        closeDropdown();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    window.addEventListener('click', onDocumentClick);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('click', onDocumentClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeDropdown, containerRef, isOpen]);

  return {
    isOpen,
    selectedOption,
    toggleDropdown,
    handleClearClick,
    handleOptionSelect
  };
}
