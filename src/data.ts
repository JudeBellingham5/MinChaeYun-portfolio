import { PortfolioData } from "./types";

export const initialData: PortfolioData = {
  name: "민채윤",
  englishName: "MIN CHAE YUN",
  email: "chaeyun9255@naver.com",
  profileImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
  birthDate: "19XX. XX. XX",
  education: [
    "XX대학교 XX학과 졸업 (20XX.XX - 20XX.XX)",
  ],
  certifications: [
    "ADsP (데이터분석 준전문가)",
    "SQLD (SQL 개발자)",
    "컴퓨터활용능력 1급",
    "GAl (Google Analytics Individual Qualification)"
  ],
  bioTitle: "문제를 정의하고, \n데이터에서 답을 찾습니다.",
  bioDescription: "저는 데이터를 단순 정리에 그치지 않고 문제 해석 도구로 사용합니다. 분석 결과를 전략 제안으로 연결하는 데 강점이 있으며, 퍼포먼스/그로스 마케팅에 깊은 관심을 가지고 있습니다.",
  mainProjects: [
    {
      id: "netflix",
      title: "넷플릭스 웹툰 원작 영상화 성공 전략 기획",
      category: "데이터 분석 + 마케팅 전략 기획",
      oneLiner: "웹툰 데이터를 분석해 넷플릭스 영상화에 적합한 작품 특성을 도출하고, 이를 바탕으로 성공 전략을 기획한 프로젝트",
      period: "2023.09 - 2023.11 (2개월)",
      tools: ["Python", "Pandas", "Matplotlib", "PowerPoint"],
      personnel: "개인 프로젝트",
      description: "분석 깊이와 전략 연결 능력을 보여주는 프로젝트입니다.",
      tasks: ["데이터 정리", "EDA", "머신러닝", "마케팅 전략 제안"],
      highlights: ["분석 깊이", "전략 연결 능력", "콘텐츠/마케팅 사고"],
      resultType: "PPT",
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: "kfc",
      title: "KFC 리브랜딩",
      category: "브랜드 문제 분석 + 리브랜딩 기획",
      oneLiner: "KFC의 브랜드 문제를 소비자 반응과 자료 조사를 통해 분석하고, 리브랜딩 방향을 제안한 프로젝트",
      period: "2023.05 - 2023.07 (2개월)",
      tools: ["PowerPoint", "Notion", "Excel"],
      personnel: "팀 프로젝트 (4인)",
      description: "브랜드 문제 정의 능력과 소비자 반응 해석 능력을 보여줍니다.",
      tasks: ["자료 조사", "리뷰 해석", "인사이트 정리", "팀장 역할 및 업무 분담"],
      highlights: ["브랜드 문제 정의 능력", "소비자 반응 해석", "팀 리딩 경험"],
      resultType: "PPT",
      image: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&q=80&w=1000",
    },
    {
      id: "franchise",
      title: "프랜차이즈 입지특성과 마케팅 성과의 관계 분석",
      category: "정량 데이터 분석 + 통계 검증 + 보고서 작성",
      oneLiner: "금별맥주와 역전할머니맥주 데이터를 분석해 입지특성과 마케팅 성과의 관계를 검토한 프로젝트",
      period: "2023.03 - 2023.05 (2개월)",
      tools: ["Python", "SPSS", "Excel"],
      personnel: "개인 프로젝트",
      description: "데이터 수집 및 전처리 역량과 정량 분석 경험을 보여줍니다.",
      tasks: ["데이터 수집 및 정제", "EDA", "통계적 검증", "간단한 마케팅 전략 수립", "보고서 작성"],
      highlights: ["데이터 수집 및 전처리 역량", "정량 분석 경험", "문서화 능력"],
      resultType: "Report",
      links: {
        ppt: "#",
        report: "#"
      },
      image: "https://images.unsplash.com/photo-1619641063346-67099686361a?auto=format&fit=crop&q=80&w=1000",
    }
  ],
  additionalWork: [
    {
      id: "breakup",
      title: "이별 극복 테스트",
      category: "간단한 웹 구현 프로젝트",
      oneLiner: "기획을 바탕으로 Streamlit을 활용해 테스트 사이트를 구현하고 배포한 프로젝트",
      period: "2024.01 (1개월)",
      tools: ["Python", "Streamlit", "GitHub"],
      personnel: "개인 프로젝트",
      description: "실행력과 구현력, 사용자 흐름 설계 경험을 보여줍니다.",
      tasks: ["UI 구성", "Python 로직 작성", "결과 화면 설계", "배포"],
      highlights: ["실행력", "구현력", "사용자 흐름 설계 경험"],
      resultType: "Site",
      links: {
        site: "#",
        github: "#"
      },
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1000",
    }
  ],
  skills: [
    {
      category: "Data Analysis",
      items: ["Python 기반 데이터 정제 및 분석", "pandas를 활용한 데이터 전처리", "EDA를 통한 패턴 파악 및 인사이트 도출"]
    },
    {
      category: "Visualization",
      items: ["matplotlib / seaborn 기반 시각화", "분석 결과를 발표 자료와 보고서 형태로 재구성"]
    },
    {
      category: "Build",
      items: ["Streamlit 기반 간단한 웹앱 구현", "결과 화면 설계 및 배포 경험"]
    },
    {
      category: "Communication",
      items: ["보고서 작성", "PPT 제작", "분석 결과를 전략 문서로 정리"]
    }
  ]
};
