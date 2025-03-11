import { useEffect, useState, useMemo, useCallback } from "react";
import BoxInput from "../../until-components/box-input/BoxInput";
import baseUrl from "../../config/baseUrl";
import BoxSelect from "../../until-components/box-select/BoxSelect";
import BoxInputSelect from "../../until-components/box_input_select/BoxInputSelect";
import { capitalizeFirstLetter } from "../../until-function/format";
import PopupVocabulary from "../popup-vocabulary/PopupVocabulary";

const partsOfSpeech = [
  "noun",
  "pronouun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
];

const limit = 50;

const listOptionsSort = ["Latest", "Oldest", "A - Z", "Z - A"];
const HomePage = () => {
  const [topicsList, setTopicsList] = useState([]); //lưu danh sách topic
  const [currentPage, setCurrentPage] = useState(1); //lưu trang hiện tại
  const [vocabularyList, setVocabularyList] = useState([]);

  const [objectQuery, setObjectQuery] = useState({
    sortValue: "latest",
    topic: "all",
    remembered: "all",
    capitalize: "all",
    search: "",
  });

  //lưu form add
  const [formDataAdd, setFormDataAdd] = useState({
    headword: "",
    meaning: "",
    partOfSpeech: "",
    topic: "",
  });

  //lưu lỗi form add
  const [errorFormDataAdd, setErrorFormDataAdd] = useState({
    headword: "",
    meaning: "",
    partOfSpeech: "",
    topic: "",
  });

  //Vocabulary on popup
  const [vocabularyOnPopup, setVocabularyOnPopup] = useState(null);

  //gọi API để lấy danh sách topic
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(baseUrl + "/vocabulary/get-topics");
        if (!response.ok) {
          throw new Error("Unable to get topic list!!");
        }

        const topicsList = await response.json();
        setTopicsList(["all", ...topicsList]);
      } catch (error) {
        console.log("Error: " + error.message);
      }
    };

    fetchTopic();
  }, []);

  //gọi API để lấy danh sách từ vựng xuống
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const response = await fetch(baseUrl + "/vocabulary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ limit, page: currentPage, ...objectQuery }),
        });

        if (!response.ok) {
          throw new Error("Unable to get vocabulary!!");
        }
        const vocabularyList = await response.json();
        setVocabularyList(vocabularyList);
      } catch (error) {
        console.log("Error: " + error.message);
      }
    };
    fetchVocabulary();
  }, [objectQuery, currentPage]);

  //hàm xử lý thay đổi input form add
  const handleChangeInputFromAdd = useCallback((e) => {
    const { name, value } = e.target;
    setFormDataAdd((prevForm) => ({ ...prevForm, [name]: value }));
  }, []);

  //hàm xử lý khi thêm từ vựng
  const handleAddVocabulary = async () => {
    const newError = { ...errorFormDataAdd };
    if (!formDataAdd.headword) {
      newError.headword = "Điền đi!!";
    } else {
      newError.headword = "";
    }

    if (!formDataAdd.meaning) {
      newError.meaning = "Điền đi!!";
    } else {
      newError.meaning = "";
    }

    if (!formDataAdd.partOfSpeech) {
      newError.partOfSpeech = "Điền đi!!";
    } else if (
      !partsOfSpeech.find((item) => item === formDataAdd.partOfSpeech)
    ) {
      newError.partOfSpeech = "Sai rồi!!";
    } else {
      newError.partOfSpeech = "";
    }

    if (!formDataAdd.topic) {
      newError.topic = "Điền đi!!";
    } else {
      newError.topic = "";
    }

    if (newError.headword || newError.meaning || newError.partOfSpeech) {
      setErrorFormDataAdd(newError);
      return;
    }

    //gọi API để cập nhật lại phía server
    try {
      const response = await fetch(baseUrl + "/vocabulary/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataAdd),
      });

      if (!response.ok) {
        throw new Error("Cannot add new vocabulary!!");
      }

      const data = await response.json();

      setFormDataAdd({
        headword: "",
        meaning: "",
        partOfSpeech: "",
        topic: formDataAdd.topic,
      });

      setErrorFormDataAdd({
        headword: "",
        meaning: "",
        partOfSpeech: "",
        topic: "",
      });

      setVocabularyList([data.vocabulary, ...vocabularyList]);
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };

  //cập nhật lại topicslistRender
  const topicsListRender = useMemo(() => {
    if (!formDataAdd.topic) return topicsList;
    return topicsList.filter((topic) =>
      topic.toLowerCase().includes(formDataAdd.topic.toLowerCase())
    );
  }, [formDataAdd.topic, topicsList]);

  //hàm xử lí khi người dùng chọn option ở boxInputSelect
  const handleSelectOptionBoxInputSelect = useCallback((name, value) => {
    setFormDataAdd((prevFrom) => ({ ...prevFrom, [name]: value }));
  }, []);

  //hàm xử lý khi người dùng lựa chọn objectQuery
  const handleSelectObjectQuery = useCallback(
    (field, value) => {
      if (objectQuery[field] === value) {
        return;
      }

      setObjectQuery((prevOb) => ({ ...prevOb, [field]: value }));
    },
    [objectQuery]
  );

  //hàm xử lý thay đổi ô input search
  const handleChangeInputSearch = (e) => {
    setObjectQuery({ ...objectQuery, search: e.target.value });
  };

  //hàm xử lý đọc đoạn từ vựng
  const handleReadVocabulary = (voc) => {
    const utterance = new SpeechSynthesisUtterance(voc);
    // Lấy danh sách các giọng
    let voices = window.speechSynthesis.getVoices();

    // Nếu danh sách rỗng (trường hợp chưa load hết), lắng nghe sự kiện voiceschanged
    if (!voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        // Chọn giọng nữ (ví dụ, tìm giọng có từ "Female" hoặc tên cụ thể)
        const femaleVoice = voices.find((voice) =>
          voice.name.toLowerCase().includes("female")
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        window.speechSynthesis.speak(utterance);
      };
    } else {
      // Nếu đã có danh sách, tìm giọng nữ ngay
      const femaleVoice = voices.find((voice) =>
        voice.name.toLowerCase().includes("female")
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    }
    window.speechSynthesis.speak(utterance);
  };

  //hàm xử lý khi xác nhận từ vựng đã thuộc hoặc thông dụng
  const handleRemembered = async (vocId, field, value) => {
    //cập nhật ở state
    const newVocabularyList = [...vocabularyList].map((voc) =>
      voc._id === vocId ? { ...voc, [field]: value } : voc
    );
    setVocabularyList(newVocabularyList);

    //goi j API để cập nhật
    try {
      const response = await fetch(baseUrl + "/vocabulary/turn-remembered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vocId, value, field }),
      });

      if (!response.ok) {
        throw new Error("Unable to turn remembered!!");
      }
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };

  //hàm xử lý khi xóa từ vựng
  const handleDeleteVocabulary = async (vocId) => {
    setVocabularyList([...vocabularyList].filter((voc) => voc._id !== vocId));

    //gọi API để xóa từ vựng
    try {
      const response = await fetch(
        baseUrl + `/vocabulary/delete-vocabulary/${vocId}`
      );

      if (!response.ok) {
        throw new Error("Unable to delete vocabulary!!");
      }
      console.log("OK");
    } catch (error) {
      console.log("Error:" + error);
    }
  };

  //hàm xử lý khi sửa popup
  const hanldeUpdateVocabulary = (voc) => {
    setVocabularyOnPopup(voc);
  };

  //hàm cập nhật lại danh sách từ vựng
  const handelUpdateVocabularyList = (newVoc) => {
    setVocabularyList(
      vocabularyList.map((voc) => (newVoc._id === voc._id ? newVoc : voc))
    );
  };

  return (
    <div className="home_page">
      <div className="nav_bar">
        <BoxSelect
          htmlFor={"nav_bar_select_topic"}
          selectedValue={objectQuery.topic}
          optionsList={topicsList}
          handleSelectOption={handleSelectObjectQuery}
          field={"topic"}
        />

        <BoxSelect
          htmlFor={"nav_bar_select_sort"}
          optionsList={listOptionsSort}
          selectedValue={objectQuery.sortValue}
          handleSelectOption={handleSelectObjectQuery}
          field={"sortValue"}
        />

        <BoxSelect
          htmlFor={"nav_bar_select_memory"}
          optionsList={["all", "remembered", "don't remember"]}
          selectedValue={objectQuery.remembered}
          handleSelectOption={handleSelectObjectQuery}
          field={"remembered"}
        />

        <BoxSelect
          htmlFor={"nav_bar_select_capitalize"}
          optionsList={["all", "common", "lest common"]}
          selectedValue={objectQuery.capitalize}
          handleSelectOption={handleSelectObjectQuery}
          field={"capitalize"}
        />
        <div className="box_search">
          <input
            type="text"
            name=""
            id=""
            placeholder="Search..."
            onChange={handleChangeInputSearch}
          />
          <div className="icon">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
      </div>

      <div className="box_content_page">
        <div className="box_add_vocabulary">
          <BoxInput
            placeholderMessage={"Headword"}
            onChangeInputValue={handleChangeInputFromAdd}
            name={"headword"}
            valueInput={formDataAdd.headword}
            errorMessage={errorFormDataAdd.headword}
          />
          <BoxInput
            placeholderMessage={"Meaning"}
            onChangeInputValue={handleChangeInputFromAdd}
            name={"meaning"}
            valueInput={formDataAdd.meaning}
            errorMessage={errorFormDataAdd.meaning}
          />
          <BoxInputSelect
            optionsList={partsOfSpeech}
            placeholderMessage={"Part of speech"}
            name={"partOfSpeech"}
            inputValue={formDataAdd.partOfSpeech}
            onChangeInput={handleChangeInputFromAdd}
            handleSelectOption={handleSelectOptionBoxInputSelect}
            errorMessage={errorFormDataAdd.partOfSpeech}
          />
          <BoxInputSelect
            optionsList={topicsListRender}
            placeholderMessage={"Topic"}
            name={"topic"}
            inputValue={formDataAdd.topic}
            onChangeInput={handleChangeInputFromAdd}
            handleSelectOption={handleSelectOptionBoxInputSelect}
            errorMessage={errorFormDataAdd.topic}
          />
          <button className="btn_dark_pink" onClick={handleAddVocabulary}>
            Add
          </button>
        </div>

        <div className="box_vocabulary_list">
          {vocabularyList.length > 0 &&
            vocabularyList.map((voc) => (
              <div className="box_vocabulary" key={voc._id}>
                <p className="desc headword">
                  {capitalizeFirstLetter(voc.headword)}
                </p>
                <p className="desc part_of_speech">
                  {`(${capitalizeFirstLetter(voc.partOfSpeech)})`}
                </p>
                <p className="desc meaning">
                  {capitalizeFirstLetter(voc.meaning)}
                </p>

                <div
                  className="icon_mic"
                  onClick={() => handleReadVocabulary(voc.headword)}
                >
                  <i className="fa-solid fa-volume-high"></i>
                </div>

                <div className="box_turn">
                  <div
                    className={`turn_remembered ${
                      voc.remembered ? "remembered" : ""
                    }`}
                    onClick={() =>
                      handleRemembered(voc._id, "remembered", !voc.remembered)
                    }
                  >
                    <div className="dot"></div>
                  </div>
                </div>

                <div
                  className={`icon_capitalize ${
                    voc.capitalize ? "active" : ""
                  }`}
                  onClick={() =>
                    handleRemembered(voc._id, "capitalize", !voc.capitalize)
                  }
                >
                  <i className="fa-solid fa-star"></i>
                </div>

                <div className="box_option_vocabulary">
                  <input
                    type="checkbox"
                    name=""
                    id={`option_vocabulary_${voc._id}`}
                  />
                  <label
                    htmlFor={`option_vocabulary_${voc._id}`}
                    className="icon"
                  >
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </label>
                  <label
                    htmlFor={`option_vocabulary_${voc._id}`}
                    className="layout_option_vocabulary"
                  ></label>
                  <div className="option_list">
                    <label
                      htmlFor={`option_vocabulary_${voc._id}`}
                      className="desc"
                      onClick={() => handleDeleteVocabulary(voc._id)}
                    >
                      Xóa
                    </label>
                    <label
                      htmlFor={`option_vocabulary_${voc._id}`}
                      className="desc"
                      onClick={() => hanldeUpdateVocabulary(voc)}
                    >
                      Sửa
                    </label>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {vocabularyOnPopup && (
        <PopupVocabulary
          vocabulary={vocabularyOnPopup}
          optionsList={partsOfSpeech}
          topicsList={topicsList}
          handelUpdateVocabularyList={handelUpdateVocabularyList}
          hanldeUpdateVocabulary={hanldeUpdateVocabulary}
        />
      )}
    </div>
  );
};

export default HomePage;
