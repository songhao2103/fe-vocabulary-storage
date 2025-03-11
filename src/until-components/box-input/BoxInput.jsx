import { memo } from "react";

const BoxInput = ({
  onChangeInputValue,
  name,
  errorMessage,
  placeholderMessage,
  valueInput,
}) => {
  return (
    <div className="box_input_component">
      <label htmlFor={name}></label>
      <p className={`desc placeholder ${valueInput ? "active" : ""}`}>
        {placeholderMessage}
      </p>
      <input
        type="text"
        name={name}
        id={name}
        value={valueInput}
        onChange={onChangeInputValue}
        placeholder={placeholderMessage}
      />
      {errorMessage && <p className="desc error">{errorMessage}</p>}
    </div>
  );
};

export default memo(BoxInput);
