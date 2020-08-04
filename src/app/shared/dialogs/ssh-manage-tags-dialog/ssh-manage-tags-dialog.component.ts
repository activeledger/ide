import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { faTrashAlt } from "@fortawesome/pro-light-svg-icons";

@Component({
  selector: "ssh-manage-tags-dialog",
  templateUrl: "./ssh-manage-tags-dialog.component.html",
  styleUrls: ["./ssh-manage-tags-dialog.component.scss"],
})
export class SshManageTagsDialogComponent implements OnInit {
  public addTags: string[];
  public removeTags: string[];

  public icons = {
    remove: faTrashAlt,
  };

  public newTag: string;

  constructor(
    public dialogRef: MatDialogRef<SshManageTagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public tags: string[]
  ) {
    this.addTags = [];
    this.removeTags = [];

    if (!this.tags) {
      this.tags = [];
    }
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
    this.tags.push(this.newTag);

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
