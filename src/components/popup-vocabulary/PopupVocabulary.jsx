import { useMemo, useState } from "react";
import BoxInput from "../../until-components/box-input/BoxInput";
import BoxInputSelect from "../../until-components/box_input_select/BoxInputSelect";
import baseUrl from "../../config/baseUrl";

const PopupVocabulary = ({
  vocabulary,
  optionsList,
  topicsList,
  handelUpdateVocabularyList,
  hanldeUpdateVocabulary,
}) => {
  const [formDataUpdate, setFormDataUpdate] = useState({
    headword: vocabulary.headword,
    meaning: vocabulary.meaning,
    partOfSpeech: vocabulary.partOfSpeech,
    topic: vocabulary.topic,
  });

  const [errorFormDataUpdate, setErrorFormDataUpdate] = useState({
    headword: "",
    meaning: "",
    partOfSpeech: "",
    topic: "",
  });

  const topicsListRender = useMemo(() => {
    if (!formDataUpdate.topic) return topicsList;
    return topicsList.filter((topic) =>
      topic.toLowerCase().includes(formDataUpdate.topic.toLowerCase())
    );
  }, [formDataUpdate.topic, topicsList]);

  //hàm xử lý thay đổi của form
  const handleChangeInputValue = (e) => {
    const { name, value } = e.target;

    setFormDataUpdate({ ...formDataUpdate, [name]: value });
  };

  //hàm xử lý khi xác nhận sửa từ vựng
  const handleConfirmUpdate = async () => {
    const newError = { ...errorFormDataUpdate };

    if (!formDataUpdate.headword) {
      newError.headword = "Điền đi!!!";
    } else {
      newError.headword = "";
    }

    if (!formDataUpdate.meaning) {
      newError.meaning = "Điền đi!!!";
    } else {
      newError.meaning = "";
    }

    if (!formDataUpdate.partOfSpeech) {
      newError.partOfSpeech = "Điền đi!!!";
    } else {
      newError.partOfSpeech = "";
    }

    if (!formDataUpdate.topic) {
      newError.topic = "Điền đi!!!";
    } else {
      newError.topic = "";
    }

    if (
      newError.partOfSpeech ||
      newError.meaning ||
      newError.headword ||
      newError.topic
    ) {
      setErrorFormDataUpdate(newError);
      return;
    }

    //cập nhật lại từ vựng
    const newVocabulary = { ...vocabulary, ...formDataUpdate };

    //gọi API để cập nhật
    try {
      const response = await fetch(baseUrl + "/vocabulary/update-vocabulary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVocabulary),
      });

      if (!response.ok) {
        throw new Error("unable to update vocabulary!!");
      }
      console.log("Update vocabulary successfully");

      //cập nhật ở danh sách
      handelUpdateVocabularyList(newVocabulary);

      //tắt popup
      hanldeUpdateVocabulary(null);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };

  return (
    <div className="popup_vocabulary">
      <div className="bgc_popup"></div>
      <div className="content_popup">
        <div className="box_input">
          <BoxInput
            placeholderMessage={"Headword"}
            name={"headword"}
            valueInput={formDataUpdate.headword}
            onChangeInputValue={handleChangeInputValue}
            errorMessage={errorFormDataUpdate.headword}
          />
          <BoxInput
            placeholderMessage={"Meaning"}
            name={"meaning"}
            valueInput={formDataUpdate.meaning}
            onChangeInputValue={handleChangeInputValue}
            errorMessage={errorFormDataUpdate.meaning}
          />

          <BoxInputSelect
            optionsList={optionsList}
            placeholderMessage={"Part of speech"}
            name={"partOfSpeech"}
            inputValue={formDataUpdate.partOfSpeech}
            onChangeInput={handleChangeInputValue}
            errorMessage={errorFormDataUpdate.partOfSpeech}
          />
          <BoxInputSelect
            optionsList={topicsListRender}
            placeholderMessage={"Topic"}
            name={"topic"}
            inputValue={formDataUpdate.topic}
            onChangeInput={handleChangeInputValue}
            errorMessage={errorFormDataUpdate.topic}
          />
        </div>

        <button className="btn_dark_pink" onClick={handleConfirmUpdate}>
          Update
        </button>
        <div className="icon close">
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>
  );
};

export default PopupVocabulary;
