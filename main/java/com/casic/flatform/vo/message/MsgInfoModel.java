package com.casic.flatform.vo.message;

public class MsgInfoModel {
        private String type;
        private Data data;
        public void setType(String type) {
            this.type = type;
        }
        public String getType() {
            return type;
        }

        public void setData(Data data) {
            this.data = data;
        }
        public Data getData() {
            return data;
        }
}
