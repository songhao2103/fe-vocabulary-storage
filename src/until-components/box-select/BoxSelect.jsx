import { memo } from "react";
import { capitalizeFirstLetter } from "../../until-function/format";

const BoxSelect = ({
  htmlFor,
  selectedValue,
  optionsList,
  handleSelectOption,
  field,
}) => {
  return (
    <div className="box_select_component">
      <input type="checkbox" name="" id={htmlFor} className="input_select" />
      <label htmlFor={htmlFor} className="layout_select"></label>
      <label htmlFor={htmlFor} className="box_result">
        <p className="desc">{capitalizeFirstLetter(selectedValue)}</p>
        <div className="icon desc">
          <i className="fa-solid fa-chevron-down"></i>
        </div>
      </label>
      <div className="selects_topic_list">
        {optionsList.map((option, index) => (
          <label
            htmlFor={htmlFor}
            className="desc"
            key={index}
            onClick={() => handleSelectOption(field, option)}
          >
            {capitalizeFirstLetter(option)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default memo(BoxSelect);
