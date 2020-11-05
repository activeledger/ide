import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "ssh-manage-tags-connection-dialog",
  templateUrl: "./ssh-manage-tags-connection-dialog.component.html",
  styleUrls: ["./ssh-manage-tags-connection-dialog.component.scss"],
})
export class SshManageTagsConnectionDialogComponent implements OnInit {
  public addTags: string[];
  public removeTags: string[];

  public icons = {
    remove: faTrashAlt,
  };

  public newTag: string;

  public nodeName: string;
  public tags: string[];
  public nodeTags: string[];

  constructor(
    public dialogRef: MatDialogRef<SshManageTagsConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { tags: string[]; nodeTags: string[]; name: string }
  ) {
    this.nodeName = this.data.name;
    this.tags = this.data.tags ? this.data.tags : [];
    this.nodeTags = this.data.nodeTags ? this.data.nodeTags : [];

    this.addTags = [];
    this.removeTags = [];
  }

  ngOnInit(): void {}

  public removeTag(tag: string): void {
    if (this.removeTags.includes(tag)) {
      this.removeTags.splice(this.removeTags.indexOf(tag), 1);
    } else {
      this.removeTags.push(tag);
    }
  }

  public addTag(): void {
    this.addTags.push(this.newTag);
    this.nodeTags.push(this.newTag);
    this.tags.splice(this.tags.indexOf(this.newTag), 1);

    this.newTag = "";
  }

  public save() {
    this.dialogRef.close({
      addTags: this.addTags,
      removeTags: this.removeTags,
    });
  }

  public cancel() {
    this.dialogRef.close();
  }
}
