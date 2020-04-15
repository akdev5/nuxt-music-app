<template>
  <section class="mt-5">
    <b-container>
      <b-row class="mb-4">
        <b-col>
          <div class="card" v-if="addState">
            <div class="card-body">
              <div class="card-title mb-4">
                <h4>Add Music</h4>
              </div>
              <form @submit.prevent="addNewMusic" enctype="multipart/form-data">
                <div class="form-group">
                  <label for="title">
                    Title <span class="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    v-model="musicDetails.title"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label for="artist">
                    Artist <span class="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    v-model="musicDetails.artist"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label for="artist">
                    Music <span class="text-danger"> *</span>
                  </label>
                  <div class="custom-file">
                    <input
                      type="file"
                      id="customFile"
                      ref="file"
                      v-on:change="handleFileUpload()"
                      class="custom-file-input"
                    />
                    <label class="custom-file-label" for="customFile">
                      Choose file
                    </label>
                  </div>
                </div>
                <div class="form-group">
                  <button class="btn btn-primary" :disabled="isDisabled">
                    <span
                      class="spinner-border spinner-border-sm"
                      v-if="addLoading"
                      role="status"
                      aria-hidden="true"
                    ></span>Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <div class="card bg-light p-1 showdow-sm">
            <div class="card-title">
              <button
                class="btn btn-info m-3"
                @click="initForm"
              >
                {{addState ? 'Cancel' : 'Add New Music'}}
              </button>
            </div>
            <div class="card-body">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Artist</th>
                    <th scope="col">Date created</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody
                  v-if="musicLoading"
                  role="status"
                >
                  <tr>
                    <td colspan="5" class="text-center">
                      <div class="spinner-border">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(music, index) in allmusic" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ music.title }}</td>
                    <td>{{ music.artist }}</td>
                    <td>{{ music.created }}</td>
                    <td>
                      <button class="btn btn-info" @click="deleteMusic(music._id)">
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        musicDetails: {
          title: '',
          artist: '',
          music: ''
        },
        allmusic: [],
        addState: false,
        addLoading: false,
        musicLoading: false,
        isValid: false
      }
    },
    computed: {
      isDisabled: function() {
        if (
          this.musicDetails.title === '' ||
          this.musicDetails.artist === '' ||
          this.musicDetails.music === ''
        ) {
          return !this.isValid
        }
      }
    },
    methods: {
      initForm() {
        this.addState = !this.addState
      },
      handleFileUpload() {
        this.musicDetails.music = this.$refs.file.files[0]
      },
      async getAllMusics() {
        this.musicLoading = true
        try {
          this.allmusic = await this.$axios.$get('/music')

          this.musicLoading = false
        } catch (err) {
          this.musicLoading = false

          this.$swal.fire({
            title: 'Error!',
            text: 'Error in fetching Musics.',
            icon: 'error'
          })
        }
      },
      addNewMusic() {
        let types = /(\.|\/)(mp3|mp4)$/i
        if (
          types.test(this.musicDetails.music.type) ||
          types.test(this.musicDetails.music.name)
        ) {
          let formData = new FormData()

          formData.append('title', this.musicDetails.title)
          formData.append('artist', this.musicDetails.artist)
          formData.append('music', this.musicDetails.music)

          this.addLoading = true

          this.$axios
            .$post('/music', formData)
            .then(response => {
              this.addLoading = false
              this.addState = false
              this.musicDetails = {}

              this.getAllMusics()

              this.$swal.fire({
                title: 'Success!',
                text: 'New Music has been added successfully.',
                icon: 'success'
              })
            })
            .catch(err => {
              this.addLoading = false

              this.$swal.fire({
                title: 'Error!',
                text: 'Something went wrong.',
                icon: 'error'
              })
            })
        } else {
          this.$swal.fire({
            title: 'Error!',
            text: 'Invalid file type.',
            icon: 'error'
          })

          return !this.isValid
        }
      },
      deleteMusic(id) {
        this.$swal.fire({
          title: 'Are you sure?',
          text: 'Once deleted, you will not be able to recover this Music.',
          icon: 'warning',
          showCancelButton: true
        }).then(({value}) => {
          if (value) {
            this.$axios
              .$delete(`/music/${id}`)
              .then(response => {
                this.getAllMusics()

                this.$swal.fire({
                  title: 'Success!',
                  text: 'Your Music file has been deleted.',
                  icon: 'success'
                })
              })
              .catch(err => {
                this.$swal.fire({
                  title: 'Error!',
                  text: 'Something went wrong.',
                  icon: 'error'
                })
              })
          } else {
            this.$swal.fire({
              title: 'Alert!',
              text: 'Your Music file is safe.',
              icon: 'info'
            })
          }
        })
      }
    },
    created() {
      this.getAllMusics()
    }
  }
</script>

