import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  apiUrl = 'http://localhost:5500';

  form: FormGroup;
  loading = false;
  imageSrc = '/assets/images/john-resig.jpeg';

  result; // file upload 수행 이후 서버로부터 수신한 데이터

  constructor(
    private fb: FormBuilder,
    private http: HttpClient) {
    this.form = this.fb.group({
      avatar: ['', Validators.required]
    });
  }

  onFileChange(files: FileList) {
    if (files && files.length > 0) {
      // For Preview
      const reader = new FileReader();
      const file = files[0];

      /* 브라우저는 보안 문제로 인해 파일 경로의 참조를 허용하지 않는다.
        따라서 파일 경로를 img 태그에 바인딩할 수 없다.
        FileReader.readAsDataURL 메소드를 사용하여 이미지 파일을 읽어
        base64 인코딩된 스트링 데이터를 취득한 후, img 태그에 바인딩한다. */
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageSrc = reader.result;
      };

      /* reactive form에서 input[type="file"]을 지원하지 않는다.
        즉 파일 선택 시에 값이 폼컨트롤에 set되지 않는다
        https://github.com/angular/angular.io/issues/3466
        form validation을 위해 file.name을 폼컨트롤에 set한다. */
      this.avatar.setValue(file.name);
    }
  }

  onSubmit(files: FileList) {
    const formData = new FormData();
    formData.append('avatar', files[0]);

    this.loading = true;
    // Send data (payload = formData)
    console.log(formData.get('avatar'));

    // 폼데이터를 서버로 전송한다.
    this.http.post(`${this.apiUrl}/upload`, formData)
      .subscribe(res => {
        this.result = res;
        this.loading = false;
        this.avatar.setValue(null);
      });
  }

  get avatar() {
    return this.form.get('avatar');
  }
}
