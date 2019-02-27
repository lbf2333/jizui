<template>
  <div style="float: left;">
    <el-select v-model="province_" value-key="id" @change="(value)=>{return selectChange(1,value)}" :clearable="isClear"  placeholder="选择省">
      <el-option
        v-for="item in location"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <el-select v-model="city_"  value-key="id" @change="(value)=>{return selectChange(2,value)}" :clearable="isClear" placeholder="选择市">
      <el-option
        v-for="item in citys"
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
    <el-select v-model="district_" value-key="id"  @change="(value)=>{return selectChange(3,value)}" :clearable="isClear" placeholder="选择区">
      <el-option
        v-for="item in districts "
        :key="item.id"
        :label="item.name"
        :value="item">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "location",
  components: {},
  props: {
    province: {
      type: Object,
      default: null
    },
    city: {
      type: Object,
      default: null
    },
    district: {
      type: Object,
      default: null
    },
    isClear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      province_: null,
      city_: null,
      district_: null,
      location: [],
      citys: [],
      districts: []
    };
  },
  computed: {},
  watch: {
    province(value) {
      // console.log(value);
      this.province_ = value || null;
      if (value) {
        this.getCitys(value.id);
      }
    },
    city(value) {
      // console.log(value);
      this.city_ = value || null;
      if (value) {
        this.getDistricts(value.id);
      }
    },
    district(value) {
      // console.log(value);
      this.district_ = value || null;
    }
  },
  mounted() {
    // console.log(this.province, this.city, this.district);
    this.province_ = this.province || null;
    if (this.province_) {
      this.getCitys(this.province_.id);
    }
    this.city_ = this.city || null;
    if (this.city_) {
      this.getDistricts(this.city_.id);
    }
    this.district_ = this.district || null;
    let location = sessionStorage.getItem("location");
    if (location) {
      this.location = JSON.parse(location);
    } else {
      this.getProvinces();
    }
  },
  methods: {
    getProvinces() {
      this.$api
        .getProvinces()
        .then(res => {
          this.location = res.params.provinces.map(item => {
            item.citys = [];
            return item;
          });
          sessionStorage.setItem("location", JSON.stringify(this.location));
          if (!this.isClear && !this.province) {
            this.$emit("update:province", this.location[0]);
            this.getCitys(this.location[0].id);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCitys(provinceId) {
      let urlParams = {
        provinceId: provinceId
      };
      this.$api
        .getCitys(urlParams)
        .then(res => {
          let citys = res.params.cities.map(item => {
            item.districts = [];
            return item;
          });
          let index = this.location.findIndex(item => {
            return item.id == provinceId;
          });
          if (index != -1) {
            this.$set(this.location[index], "citys", citys);
          }
          this.citys = this.location[index].citys;
          sessionStorage.setItem("location", JSON.stringify(this.location));
          if (!this.isClear && !this.city) {
            this.$emit("update:city", citys[0]);
            this.getDistricts(citys[0].id);
          }
          // console.log(this.location);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDistricts(cityId) {
      let urlParams = {
        cityId: cityId
      };
      this.$api
        .getDistricts(urlParams)
        .then(res => {
          let districts = res.params.districts;
          let index = [];
          for (let i = 0; i < this.location.length; i++) {
            let index2 = this.location[i].citys.findIndex(city => {
              return city.id == cityId;
            });
            if (index2 != -1) {
              index = [i, index2];
              break;
            }
          }
          // console.log(index);
          if (index != -1) {
            this.$set(
              this.location[index[0]].citys[index[1]],
              "districts",
              districts
            );
          }
          this.districts = this.location[index[0]].citys[index[1]].districts;
          if (!this.isClear && !this.district) {
            this.$emit("update:district", this.districts[0]);
          }
          sessionStorage.setItem("location", JSON.stringify(this.location));
          // console.log(this.location);
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectChange(type, value) {
      console.log(type, value);
      if (value) {
        if (value.type == 1) {
          this.$emit("update:province", value);
          this.$emit("update:city", null);
          this.$emit("update:district", null);
          this.districts = [];
          let index = this.location.findIndex(item => {
            return item.id == value.id;
          });
          if (this.location[index].citys.length == 0) {
            this.getCitys(value.id);
          } else {
            this.citys = this.location[index].citys;
            if (!this.isClear) {
              this.$emit("update:city", this.citys[0]);
              let index = [];
              for (let i = 0; i < this.location.length; i++) {
                let index2 = this.location[i].citys.findIndex(city => {
                  return city.id == this.citys[0].id;
                });
                if (index2 != -1) {
                  index = [i, index2];
                  break;
                }
              }
              if (
                this.location[index[0]].citys[index[1]].districts.length == 0
              ) {
                this.getDistricts(this.citys[0].id);
              } else {
                this.districts = this.location[index[0]].citys[
                  index[1]
                ].districts;
                if (!this.isClear) {
                  this.$emit("update:district", this.districts[0]);
                }
              }
            }
          }
        } else if (value.type == 2) {
          this.$emit("update:city", value);
          this.$emit("update:district", null);
          let index = [];
          for (let i = 0; i < this.location.length; i++) {
            let index2 = this.location[i].citys.findIndex(city => {
              return city.id == value.id;
            });
            if (index2 != -1) {
              index = [i, index2];
              break;
            }
          }
          if (this.location[index[0]].citys[index[1]].districts.length == 0) {
            this.getDistricts(value.id);
          } else {
            this.districts = this.location[index[0]].citys[index[1]].districts;
            if (!this.isClear) {
              this.$emit("update:district", this.districts[0]);
            }
          }
        } else {
          this.$emit("update:district", value);
        }
      } else {
        if (type == 1) {
          this.$emit("update:province", null);
          this.$emit("update:city", null);
          this.$emit("update:district", null);
          this.citys = [];
          this.districts = [];
        } else if (type == 2) {
          this.$emit("update:city", null);
          this.$emit("update:district", null);
          this.districts = [];
        } else {
          this.$emit("update:district", null);
        }
      }
      this.$emit("selectChange");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
