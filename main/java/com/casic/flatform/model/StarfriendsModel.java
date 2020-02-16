package com.casic.flatform.model;

import java.util.List;

/**
 * @author 忠
 * @Description
 * @date 2018-12-14 11:14
 */
public class StarfriendsModel {
        private String name;
        private String date;
        private int time;
        private int file;
        private List<Content> content;
        public void setName(String name) {
            this.name = name;
        }
        public String getName() {
            return name;
        }

        public void setDate(String date) {
            this.date = date;
        }
        public String getDate() {
            return date;
        }

        public void setTime(int time) {
            this.time = time;
        }
        public int getTime() {
            return time;
        }

        public void setFile(int file) {
            this.file = file;
        }
        public int getFile() {
            return file;
        }

        public void setContent(List<Content> content) {
            this.content = content;
        }
        public List<Content> getContent() {
            return content;
        }
}
