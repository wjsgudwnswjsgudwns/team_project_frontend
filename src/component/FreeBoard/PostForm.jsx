import { useRef, useEffect, useState } from "react";

export default function PostForm({
  formData,
  isEditing,
  onFormChange,
  onSubmit,
  onCancel,
}) {
  const contentEditableRef = useRef(null);
  const fileInputRef = useRef(null);
  const isComposingRef = useRef(false);

  // 로컬 상태로 제목 관리
  const [localTitle, setLocalTitle] = useState(formData.fTitle);

  // 부모로부터 받은 formData가 변경될 때만 동기화
  useEffect(() => {
    setLocalTitle(formData.fTitle);
  }, [formData.fTitle]);

  useEffect(() => {
    if (contentEditableRef.current) {
      // 기존 내용과 다를 때만 업데이트
      if (contentEditableRef.current.innerHTML !== formData.fContent) {
        contentEditableRef.current.innerHTML = formData.fContent || "";
      }
    }
  }, [formData.fContent, isEditing]);

  const handleImageInsert = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}은(는) 5MB를 초과합니다.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement("img");
        img.src = reader.result;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.margin = "10px 0";

        if (contentEditableRef.current) {
          contentEditableRef.current.focus();

          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(img);

            range.setStartAfter(img);
            range.setEndAfter(img);
            selection.removeAllRanges();
            selection.addRange(range);
          }

          // 즉시 부모에게 알림
          onFormChange({
            fTitle: localTitle,
            fContent: contentEditableRef.current.innerHTML,
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContentChange = () => {
    // 한글 조합 중이면 무시
    if (isComposingRef.current) return;

    if (contentEditableRef.current) {
      onFormChange({
        fTitle: localTitle,
        fContent: contentEditableRef.current.innerHTML,
      });
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    // 조합이 끝났을 때 한 번만 업데이트
    if (contentEditableRef.current) {
      onFormChange({
        fTitle: localTitle,
        fContent: contentEditableRef.current.innerHTML,
      });
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);

    // 부모에게 즉시 알림
    onFormChange({
      fTitle: newTitle,
      fContent: contentEditableRef.current?.innerHTML || formData.fContent,
    });
  };

  return (
    <div className="write-form">
      <input
        type="text"
        placeholder="제목"
        value={localTitle}
        onChange={handleTitleChange}
        className="title-input"
      />

      <div className="image-insert-area">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="image-insert-btn"
        >
          📷 이미지 삽입
        </button>
        <span className="image-insert-note">
          커서 위치에 이미지가 삽입됩니다 (최대 5MB)
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageInsert}
        style={{ display: "none" }}
      />

      <div
        ref={contentEditableRef}
        contentEditable
        onInput={handleContentChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        placeholder="내용을 입력하세요..."
        className="content-editor"
        suppressContentEditableWarning
      />

      <div className="form-buttons">
        <button onClick={onSubmit} className="form-submit-btn">
          {isEditing ? "수정하기" : "작성하기"}
        </button>
        {isEditing && onCancel && (
          <button onClick={onCancel} className="form-cancel-btn">
            취소
          </button>
        )}
      </div>
    </div>
  );
}
