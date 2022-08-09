import { PlusOutlined } from '@ant-design/icons';
import { Input, Tag, Tooltip } from 'antd';
import { isArray } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const Tags: React.FC = ({ onChange, value }: any) => {
  const [tags, setTags] = useState<Array<string>>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  useEffect(() => {
    if (value && isArray(value)) {
      setTags(value)
    }
  }, [value])
  useEffect(() => {
    if (inputVisible) {
      const { current } = inputRef as any
      current?.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    const { current } = editInputRef as any
    current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag: any) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    onChange(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      onChange([...tags, inputValue]);
    }

    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: any) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    onChange(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };

  return (
    <div className={styles.tagsBox}>
      {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              className="tag-input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            className="edit-tag"
            key={tag}
            closable={true}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={(e) => {
                // if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                // }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          maxLength={8}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className="site-tag-plus" onClick={showInput}>
          <PlusOutlined /> 添加
        </Tag>
      )}
    </div>
  );
};

export default Tags;