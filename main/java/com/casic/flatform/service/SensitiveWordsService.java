package com.casic.flatform.service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import com.casic.flatform.model.SensitiveWordModel;
import com.casic.flatform.pageModel.SensitiveWord;

public interface SensitiveWordsService {
	/**
	 * 分页获得敏感词列表
	 * 
	 * @param sensitiveWord
	 * @param page
	 * @param rows
	 * @return
	 */
	List<SensitiveWord> querySensitiveWordList(String sensitiveWord, Integer page, Integer rows);

	/**
	 * 分页查询敏感词时获得总数
	 * 
	 * @param sensitiveWord
	 * @return
	 */
	Long querySensitiveWordCount(String sensitiveWord);

	/**
	 * 删除敏感词
	 * 
	 * @param id
	 * @return
	 */
	void deleteSensitiveWordById(String id);

	/**
	 * 新增敏感词
	 * 
	 * @param sensitiveWord
	 * @return
	 */
	void saveSensitiveWord(SensitiveWordModel sensitiveWord);

	/**
	 * 更新敏感词
	 * 
	 * @param sensitiveWord
	 * @return
	 */
	void updateSensitiveWord(SensitiveWordModel sensitiveWord);

	/**
	 * 获得敏感词信息
	 * 
	 * @param id
	 * @return
	 */
	SensitiveWordModel querySensitiveWord(String id);

	/**
	 * 删除敏感词
	 * 
	 * @param id
	 * @return
	 */
	void deleteSensitiveWord(List<Long> idList);

	/**
	 * 验证关键词是否重复
	 * 
	 * @param id
	 * @param word
	 * @return
	 */
	Boolean checkSensitiveWord(Long id, String word);

	/**
	 * 获得敏感词map
	 * 
	 * @return
	 */
	ConcurrentHashMap<String, String> getSensitiveWordMap();

	/**
	 * 更新缓存中的敏感词
	 */
	void updateSensitiveWordMap();

}
