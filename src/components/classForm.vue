<template>
  <div>
    <!-- contact-us section start -->
    <section class="contact-us" id="contact-us">
      <div class="container">
        <div class="section-header">
          <div class="section-header__content">
            <h4 class="sub-title">CLASS</h4>
            <h2 class="title">클래스 등록하기</h2>
          </div>
        </div>

        <!-- <div class="row justify-content-between align-items-center"> -->
        <form @submit.prevent="saveClass">
          <div class="flex-wrapper">
            <div class="flex-box-2 section-banner">
              <!-- <img
                :src="`https://source.unsplash.com/random/300x250/?dessert`"
                class="card-img-top"
              /> -->
              <img
                v-if="updateFlag"
                :src="getImageUrl()"
                class="card-img-top"
              />
              <img v-else src="@/assets/images/26.jpg" class="card-img-top" />
            </div>

            <!-- <div class="flex-wrapper"> -->
            <div class="flex-box-2">
              <div class="mb-5">
                <label for="clsName" class="form-label">클래스 이름</label>
                <input
                  v-model="cls.clsName"
                  type="text"
                  class="form-control"
                  id="clsName"
                />
              </div>

              <div class="flex-wrapper">
                <div class="flex-box-3 mb-5">
                  <label class="form-label" for="cateCd">종류</label>
                  <select
                    v-model="cls.cateCd"
                    class="form-select"
                    id="cateCd"
                    name="cateCd"
                  >
                    <option v-if="!cateList.length" value="0">
                      카테고리를 불러오지 못했습니다
                    </option>
                    <option
                      v-else
                      v-for="item in cateList"
                      :key="item.cateCd"
                      :value="item.cateCd"
                    >
                      {{ item.cateNm }}
                    </option>
                  </select>
                </div>
                <div class="flex-box-3 mb-5">
                  <label class="form-label" for="status">상태</label>
                  <select
                    v-model="cls.status"
                    class="form-select"
                    id="status"
                    name="status"
                  >
                    <option value="1" selected>모집중</option>
                    <option value="2">모집마감</option>
                  </select>
                </div>
                <div class="flex-box-3 mb-5">
                  <label class="form-label" for="price">가격</label>
                  <input
                    v-model="cls.price"
                    @change="setPrice()"
                    type="text"
                    id="price"
                    name="price"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="flex-wrapper">
                <div class="flex-box-3 mb-5">
                  <label class="form-label" for="sidoCd">시도</label>
                  <select
                    v-model="cls.sidoCd"
                    @change="setSigList(cls.sidoCd)"
                    class="form-select"
                    id="sidoCd"
                    name="sidoCd"
                  >
                    <option v-if="!sidoList.length">
                      시도를 불러오지 못했습니다
                    </option>
                    <option
                      v-else
                      v-for="item in sidoList"
                      :key="item.CTPRVN_CD"
                      :value="item.CTPRVN_CD"
                    >
                      {{ item.CTP_KOR_NM }}
                    </option>
                  </select>
                </div>
                <div class="flex-box-3 mb-5">
                  <label class="form-label" for="sigCd">시군구</label>
                  <select
                    v-model="cls.sigCd"
                    class="form-select"
                    id="sigCd"
                    name="sigCd"
                  >
                    <option v-if="!sigList.length">시도를 선택해주세요</option>
                    <option
                      v-else
                      v-for="item in sigList"
                      :key="item.SIG_CD"
                      :value="item.SIG_CD"
                    >
                      {{ item.SIG_KOR_NM }}
                    </option>
                  </select>
                </div>
                <div class="flex-box-3 mb-5">
                  <label class="form-label" for="time">소요시간 </label>
                  <input
                    v-model="cls.time"
                    class="form-control"
                    id="time"
                    name="time"
                    type="text"
                    de
                  />
                </div>
              </div>
              <div class="mb-5">
                <label class="form-label" for="expln">클래스 소개</label>
                <textarea
                  v-model="cls.expln"
                  class="form-control"
                  id="expln"
                  name="expln"
                  rows="9"
                ></textarea>
              </div>
            </div>
            <!-- </div> -->
          </div>
          <div class="row mt-5">
            <div class="col text-center">
              <button type="submit" class="btn btn-primary m-3">저장</button>
              <button
                type="button"
                @click="goClassList()"
                class="btn btn-secondary m-3"
              >
                취소
              </button>
            </div>
          </div>
          <!-- </div> -->
        </form>
      </div>
    </section>
    <!-- contact-us section end -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { moneyUnit } from '@/stores/moneyUnitStore';
import { commonStore } from '@/stores/commonCodeStore';

const router = useRouter();
const route = useRoute();
const moneyUnitStore = moneyUnit();
const commonCodeStore = commonStore();

//false=등록, true=수정
const updateFlag = route.name === 'ClassCreate' ? false : true;

const cateList = ref([]);
const sidoList = ref([]);
const sigList = ref([]);

//클래스 등록 시 초기값
const cls = ref({});

// onBeforeMount(() => {
//   cateList.value = commonCodeStore.getCategory();
//   console.log('? ', cateList.value);
// });

onMounted(() => {
  setSidoList();
  setCateList();
  initClassEdit();
});

const initClassEdit = () => {
  //등록
  if (!updateFlag) resetCls();
  //수정
  else getCls();
};

//cls 초기화
const resetCls = () => {
  cls.value = {
    clsImg: 0,
    clsName: '',
    teacher: '김강사',
    cateCd: 1,
    cateNm: '',
    status: '1',
    sidoCd: '11',
    sidoNm: '',
    sigCd: '',
    sigNm: '',
    price: '0',
    studentMax: '5',
    time: '1',
    expln: '',
  };
};

//수정 시 데이터 조회
const getCls = async () => {
  const paramClsId = route.params.id;

  try {
    const res = await axios.get(`http://localhost:5000/class/${paramClsId}`);
    cls.value = {
      ...res.data,
    };
    cls.value.price = moneyUnitStore.numberUnit(cls.value.price);
    //console.log(res);
  } catch (err) {
    console.log('getCls err : ', err);
  }
};

//수정 시 이미지 url 생성
const getImageUrl = () => {
  const imgUrl = new URL(
    `/src/assets/images/${cls.value.id}.jpg`,
    import.meta.url,
  ).href;
  //console.log('cls.value.id : ', cls.value.id);
  //console.log('imgUrl : ', imgUrl);
  return imgUrl;
};

//카테고리 목록세팅
const setCateList = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/categoryCode?_sort=cateCd&_order=asc`,
    );
    cateList.value = res.data;
  } catch (err) {
    console.log('setCateList err : ', err);
    cateList.value = 0;
  }
};

//시도 목록세팅
const setSidoList = async () => {
  try {
    const res = await axios.get(
      `http://localhost:5000/sidoCd?_sort=CTP_KOR_NM&_order=asc`,
    );
    sidoList.value = res.data;
    setSigList('11');
  } catch (err) {
    console.log('setSidoList err : ', err);
  }
};

//시군구 목록세팅
const setSigList = async (sidoCd) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/sigCd?&SIG_CD_like=${sidoCd}&_sort=SIG_KOR_NM&_order=asc`,
    );

    //시도에 해당하는 시군구 필터링
    sigList.value = res.data;
    sigList.value = sigList.value.filter((e) => e.SIG_CD.startsWith(sidoCd));
    //시군구 기본값 세팅
    cls.value.sigCd = sigList.value[0].SIG_CD;
  } catch (err) {
    console.log('setSigList err : ', err);
  }
};

//가격 세팅
const setPrice = () => {
  cls.value.price = moneyUnitStore.deleteChar(cls.value.price);
  cls.value.price = moneyUnitStore.numberUnit(cls.value.price);
};

//jsonServer저장용 카테고리 코드-이름매칭
const mappingCate = () => {
  cls.value.cateNm = cateList.value.find(
    (e) => e.cateCd === cls.value.cateCd,
  ).cateNm;
};

//jsonServer저장용 시도 코드-이름매칭
const mappingSido = () => {
  cls.value.sidoNm = sidoList.value.find(
    (e) => e.CTPRVN_CD === cls.value.sidoCd,
  ).CTP_KOR_NM;
};

//jsonServer저장용 시군구 코드-이름매칭
const mappingSig = () => {
  cls.value.sigNm = sigList.value.find(
    (e) => e.SIG_CD === cls.value.sigCd,
  ).SIG_KOR_NM;
};

//jsonServer저장용 공통 코드-이름매칭
const mappingCdNm = (paramList, paramCode, paraNm) => {
  console.log('paramCode : ' + paramCode + ', paraNm: ' + paraNm);

  cls.value.cateNm = cateList.value.find(
    (e) => e.cateCd === cls.value.cateCd,
  ).cateNm;
};

// const validationCheck = () => {
//   const valiChk = false;

//   console.log('cls : ', cls);
//   return valiChk;
// };

//목록으로 이동
const goClassList = () => {
  router.push({
    path: '/classList',
  });
};

//클래스 저장
const saveClass = async () => {
  //validationCheck();
  mappingCate();
  mappingSido();
  mappingSig();

  const data = {
    clsImg: cls.value.clsImg,
    clsName: cls.value.clsName,
    teacher: cls.value.teacher,
    cateCd: cls.value.cateCd,
    cateNm: cls.value.cateNm,
    status: cls.value.status,
    sidoCd: cls.value.sidoCd,
    sidoNm: cls.value.sidoNm,
    sigCd: cls.value.sigCd,
    sigNm: cls.value.sigNm,
    price: cls.value.price,
    studentMax: cls.value.studentMax,
    time: cls.value.time,
    expln: cls.value.expln,
  };

  //등록
  if (!updateFlag) {
    try {
      await axios.post('http://localhost:5000/class', data);
    } catch (err) {
      console.log('등록 err : ', err);
    }

    //수정
  } else {
    const paramClsId = route.params.id;
    try {
      await axios.put('http://localhost:5000/class/' + paramClsId, data);
    } catch (err) {
      console.log('수정 err : ', err);
    }
  }
  goClassList();
};
</script>

<style scoped>
.flex-wrapper {
  display: flex;
  margin-bottom: 1rem !important;
}
.flex-box-2 {
  flex: 50% 0 0;
  width: calc(100% / 2);
  padding: 0px 30px;
}
.flex-box-2 > img {
  margin-top: 40px;
}
.flex-box-3 {
  flex: 33% 0 0;
  width: calc(100% / 3);
  padding: 0px 10px;
}
</style>
