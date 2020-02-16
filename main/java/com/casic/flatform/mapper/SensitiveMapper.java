package com.casic.flatform.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.casic.flatform.model.SensitiveWordModel;

/**
 * 敏感词Mapper
 * @author hanxu
 */
public interface SensitiveMapper {

	/**
	 * 分页获得敏感词列表
	 * @return
	 */
	public List<SensitiveWordModel> querySensitiveWordList(@Param("sensitiveWord") String sensitiveWord,
			@Param("start") Integer start, @Param("rows") Integer rows);
	
	/**
	 * 分页查询时获得总数
	 * @return
	 */
	public Long querySensitiveWordCount(@Param("sensitiveWord") String sensitiveWord);

	/**
	 * 新增敏感词
	 */
	public void saveSensitiveWord(SensitiveWordModel sensitiveWord);
	
	/**
	 * 更新敏感词
	 */
	public void updateSensitiveWord(SensitiveWordModel sensitiveWord);
	
	/**
	 * 删除敏感词
	 * @param id
	 */
	public void deleteSensitiveWordById(String id);

	/**
	 * 删除敏感词
	 * @param id
	 */
	public void deleteSensitiveWord(@Param("idList") List<Long> idList);
	
	/**
	 * 获得敏感词信息
	 * @param id
	 */
	public SensitiveWordModel querySensitiveWord(String id);
	
	/**
	 * 通过敏感词名称获得敏感词信息列表
	 * @return
	 */
	public List<SensitiveWordModel> getSensitiveWordByWord(String word);
	
	/**
	 * 获得全部可用敏感词
	 * @return
	 */
	public List<SensitiveWordModel> getAllSensitiveWord();
}
