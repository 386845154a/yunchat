package com.casic.flatform.service.impl;

import com.casic.flatform.mapper.SensitiveMapper;
import com.casic.flatform.model.SensitiveWordModel;
import com.casic.flatform.pageModel.SensitiveWord;
import com.casic.flatform.service.SensitiveWordsService;
import com.casic.flatform.util.ConfigParameterUtil;
import com.casic.flatform.util.HttpUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 敏感词
 * 
 * @author hanxu
 */
@Service
@Transactional
public class SensitiveWordsServiceImpl implements SensitiveWordsService {

	@Value("${node.ip}")
	private String nodeServerIp;

	@Autowired
	private SensitiveMapper sensitiveMapper;

	/**
	 * 分页获得敏感词列表
	 * 
	 * @param sensitiveWord
	 * @param page
	 * @param rows
	 * @return
	 */
	@Override
	public List<SensitiveWord> querySensitiveWordList(String sensitiveWord, Integer page, Integer rows) {
		return changeModel(sensitiveMapper.querySensitiveWordList(sensitiveWord, (rows * (page - 1)+1), page*rows));
	}

	/**
	 * 类型转换
	 * 
	 * @return
	 */
	private List<SensitiveWord> changeModel(List<SensitiveWordModel> SensitiveList) {
		List<SensitiveWord> list = new ArrayList<>();

		if (SensitiveList != null) {
			for (SensitiveWordModel model : SensitiveList) {
				SensitiveWord sensitiveWord = new SensitiveWord();
				BeanUtils.copyProperties(model, sensitiveWord);
				list.add(sensitiveWord);
			}
		}
		return list;
	}

	/**
	 * 分页查询敏感词时获得总数
	 * 
	 * @param sensitiveWord
	 * @return
	 */
	@Override
	public Long querySensitiveWordCount(String sensitiveWord) {
		return sensitiveMapper.querySensitiveWordCount(sensitiveWord);
	}

	/**
	 * 更新敏感词
	 * 
	 * @param sensitiveWord
	 * @return
	 */
	@Override
	public void updateSensitiveWord(SensitiveWordModel sensitiveWord) {
		sensitiveMapper.updateSensitiveWord(sensitiveWord);
	}

	/**
	 * 新增敏感词
	 * 
	 * @param sensitiveWord
	 * @return
	 */
	@Override
	public void saveSensitiveWord(SensitiveWordModel sensitiveWord) {
		sensitiveMapper.saveSensitiveWord(sensitiveWord);
	};

	/**
	 * 删除敏感词
	 * 
	 * @param id
	 * @return
	 */
	@Override
	public void deleteSensitiveWordById(String id) {
		sensitiveMapper.deleteSensitiveWordById(id);
	}
	
	/**
	 * 删除敏感词
	 * 
	 * @param id
	 * @return
	 */
	@Override
	public void deleteSensitiveWord(List<Long> idList) {
		sensitiveMapper.deleteSensitiveWord(idList);
	}

	/**
	 * 获得敏感词信息
	 * 
	 * @param id
	 * @return
	 */
	@Override
	public SensitiveWordModel querySensitiveWord(String id) {
		return sensitiveMapper.querySensitiveWord(id);
	}
	
	/**
	 * 验证关键词是否重复
	 * @param id
	 * @param word
	 * @return
	 */
	@Override
	public Boolean checkSensitiveWord(Long id, String word) {
		List<SensitiveWordModel> list = sensitiveMapper.getSensitiveWordByWord(word);
		if (id == null) {
			if (list.size() > 0) {
				return false;
			}
			return true;
		}else {
			for (SensitiveWordModel model : list) {
				if (id.equals(model.getId())) {
					return true;
				}
			}
			return false;
		}
	}
	
	/**
	 * 获得敏感词map
	 * @return
	 */
	@Override
	public ConcurrentHashMap<String, String> getSensitiveWordMap() {
		//缓存不为空返回缓存
		if (ConfigParameterUtil.sensitiveWordMap != null) {
			return ConfigParameterUtil.sensitiveWordMap;
		}
		
		this.updateSensitiveWordMap();
		
		return ConfigParameterUtil.sensitiveWordMap;
	}

	/**
	 * 更新缓存中的敏感词
	 */
	@Override
	public void updateSensitiveWordMap() {
		//启动线程更新敏感词
		new Thread(new Runnable() {
			@Override
			public void run() {
				List<SensitiveWordModel> list = sensitiveMapper.getAllSensitiveWord();
				ConcurrentHashMap<String, String> sensitiveWordMap = new ConcurrentHashMap<> ();
				for (SensitiveWordModel model : list) {
					sensitiveWordMap.put(model.getSensitiveWord(), model.getReplaceWord());
				}
				ConfigParameterUtil.sensitiveWordMap = sensitiveWordMap;
				String updateSensitiveWordUrl = ConfigParameterUtil.getConfigByName("updateSensitiveWordUrl",
						nodeServerIp + "/interface/msg/updateSensitiveWord");
//				String updateSensitiveWordUrl = ConfigParameterUtil.getConfigByName("updateSensitiveWordUrl", 
//						"http://127.0.0.1:8082/interface/msg/updateSensitiveWord");
				HttpUtil.sendGet(updateSensitiveWordUrl, "");
			}
		}).start();
		
	}
	
}
