import { useEffect, useState } from "react";
import { Progress, Modal, Rate, theme } from "antd";
import { useSelector } from "react-redux";
import { createScore, getScores } from "@/services/score";
import { CloseOutlined } from "@ant-design/icons/lib/icons";

const { useToken } = theme;

export default function Score() {
  const [isScored, setIsScored] = useState(false); //是否已经评过分
  const [scores, setScores] = useState([]); //所有评分列表
  const [userScore, setUserScore] = useState(4); //当前用户的评分值
  const [average, setAverage] = useState(0); //平均分
  const [rankList, setRankList] = useState([]); //1-5星的占比
  const [visible, setVisible] = useState(true);
  const user = useSelector((state) => state.user);
  const { token } = useToken();

  /**获取评分列表*/
  const handleScores = async () => {
    const res = await getScores();
    const list = res.data || [];
    const total = list.reduce((total, current) => total + current.score, 0);
    const average = (total * 2) / list.length;
    let rankList = [];
    for (let i = 0; i < 5; i++) {
      const num =
        list.filter((item) => item.score === 5 - i).length / list.length;
      rankList[i] = Number((num * 100).toFixed(1));
    }
    setIsScored(!!list.find((item) => item.userId === user.id));
    setScores(list);
    setAverage(average.toFixed(1));
    setRankList(rankList);
  };

  /**评分*/
  const onCreateScore = (num) => {
    Modal.confirm({
      title: "提示",
      content: (
        <div>
          确定当前评分 <Rate disabled defaultValue={num} />
        </div>
      ),
      onOk: async () => {
        const res = await createScore({ score: num, userId: user.id });
        if (res.status === 0) {
          handleScores();
          setUserScore(num);
        }
      },
    });
  };

  useEffect(() => {
    handleScores();
  }, []);

  /**计算显示平均分的星星，满分10分，一分为半星，大于0小于0.5不算星，大于等于0.5小于1算半星*/
  const handleScore = (score) => {
    const interger = Math.floor(+score); //取整数部分
    const decimal = score - interger >= 0.5 ? 1 : 0;
    return (interger + decimal) / 2;
  };

  const desc = ["有bug", "再接再厉", "有待提高", "不错", "666"];
  return isScored ? (
    <div style={{ display: visible ? "block" : "none" }}>
      <div className="info">
        <div className="average-num">{average}</div>
        <div>
          <div>
            <Rate disabled defaultValue={handleScore(average)} allowHalf />
            <div className="people-num">{scores.length}人评价</div>
          </div>
          <div className="close-box" onClick={() => setVisible(false)}>
            <CloseOutlined />
          </div>
        </div>
      </div>
      <div>
        {rankList.map((item, index) => (
          <div key={index} className="star-item">
            <div className="star-label">{5 - index}星</div>
            <Progress
              percent={item}
              status="active"
              strokeLinecap="square"
              strokeWidth={10}
              strokeColor={token.colorPrimary}
            />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>
      <Rate
        tooltips={desc}
        value={userScore}
        allowClear={false}
        onChange={onCreateScore}
      />
      <span style={{ color: "#888" }}>{desc[userScore - 1]}</span>
    </div>
  );
}
