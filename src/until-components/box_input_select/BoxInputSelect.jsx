import { useState, memo } from "react";
import { capitalizeFirstLetter } from "../../until-function/format";

const BoxInputSelect = ({
  optionsList,
  inputValue,
  placeholderMessage,
  errorMessage,
  onChangeInput,
  name,
  handleSelectOption,
}) => {
  const [isActive, setIsActive] = useState(false);

  //hàm xử lý khi focus vào ô input
  const handleFocusInput = () => {
    setIsActive(true);
  };

  //hàm xử lý ẩn box_select
  const handleCloseBoxSelect = () => {
    setIsActive(false);
  };

  return (
    <div className="box_input_select_component">
      <input
        type="text"
        value={inputValue}
        placeholder={placeholderMessage}
        onChange={onChangeInput}
        name={name}
        onFocus={handleFocusInput}
      />

      {errorMessage && <p className="desc error">{errorMessage}</p>}

      <div
        className={`layout_input_select ${isActive ? "active" : ""}`}
        onClick={handleCloseBoxSelect}
      ></div>
      {inputValue && (
        <p className="desc placeholder_message">
          {capitalizeFirstLetter(placeholderMessage)}
        </p>
      )}

      {optionsList?.length > 0 && (
        <div className={`box_options_list ${isActive ? "active" : ""}`}>
          {optionsList.map((option) => (
            <p
              className="desc"
              key={option}
              //sử dụng onClickCapture sẽ gọi hàm ở component cha trước rồi mới hàm ở component con
              onClickCapture={(e) => {
                handleSelectOption(name, option); // Hàm này sẽ được gọi trước
                handleCloseBoxSelect(e); // Sau đó hàm này được gọi
              }}
            >
              {capitalizeFirstLetter(option)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(BoxInputSelect);
