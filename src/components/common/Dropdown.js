import { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useDropdown } from '../../hooks/useDropdown';

const DEFAULT_PLACEHOLDER = 'Select';

export function Dropdown({
  options = [],
  value = null,
  onChange,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled = false,
  className
}) {
  const containerRef = useRef(null);
  const {
    isOpen,
    selectedOption,
    toggleDropdown,
    handleClearClick,
    handleOptionSelect
  } = useDropdown({
    options,
    value,
    onChange,
    disabled,
    containerRef
  });

  const onOptionClick = useCallback(
    (event) => {
      handleOptionSelect(event.currentTarget.dataset.value);
    },
    [handleOptionSelect]
  );
  const onClearKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        handleClearClick(event);
      }
    },
    [handleClearClick]
  );

  return (
    <Container className={className} ref={containerRef}>
      <Trigger type="button" onClick={toggleDropdown} disabled={disabled}>
        <TriggerText _isPlaceholder={!selectedOption}>
          {selectedOption?.label || placeholder}
        </TriggerText>
        {selectedOption && !isOpen ? (
          <ClearButton
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={handleClearClick}
            onKeyDown={onClearKeyDown}
            aria-disabled={disabled}
            aria-label="Clear selected option"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L9 9M9 1L1 9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </ClearButton>
        ) : (
          <Arrow _isOpen={isOpen}>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.800049 0.800049L4.80005 4.80005L8.80005 0.800049"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Arrow>
        )}
      </Trigger>

      {isOpen && (
        <Menu>
          <MenuScroll>
            {options.map((option) => (
              <Option
                key={option.value}
                type="button"
                data-value={option.value}
                onClick={onOptionClick}
                _isSelected={option.value === value}
              >
                {option.label}
              </Option>
            ))}
          </MenuScroll>
        </Menu>
      )}
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 280px;
`;

const Trigger = styled.button`
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #83bf46;
  background: #263750;
  color: #fff;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--light-main);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TriggerText = styled.span`
  color: ${({ _isPlaceholder }) => (_isPlaceholder ? '#9aadc9' : '#fff')};
`;

const Arrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #b2b2b2;
  transform: rotate(${({ _isOpen }) => (_isOpen ? 180 : 0)}deg);
  transition: transform 0.2s ease, color 0.2s ease;

  ${Trigger}:hover:not(:disabled) & {
    color: #83bf46;
  }
`;

const ClearButton = styled.span`
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #b2b2b2;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #83bf46;
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  background: #ffffff;
  border: 1px solid #83bf46;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
`;

const MenuScroll = styled.div`
  max-height: 182px;
  overflow-y: auto;
`;

const Option = styled.button`
  width: 100%;
  display: block;
  text-align: left;
  border: none;
  color: #000000;
  font-weight: ${({ _isSelected }) => (_isSelected ? 700 : 400)};
  padding: 10px 12px;
  cursor: pointer;

  &:hover {
    background: #e6f2da;
  }
`;
