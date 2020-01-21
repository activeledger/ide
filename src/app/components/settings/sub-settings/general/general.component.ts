/*
 * MIT License (MIT)
 * Copyright (c) 2018 Activeledger
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Component, OnInit } from "@angular/core";
import { GeneralService } from "../../../../shared/services/general.service";
import { GeneralSettingsData } from "../../../../shared/structures/settings.structures";

@Component({
  selector: "app-settings-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.css"]
})
export class GeneralComponent implements OnInit {
  // #region UI Data
  public generalSettings: GeneralSettingsData = new GeneralSettingsData();
  // #endregion

  /**
   * Creates an instance of GeneralComponent.
   * @param {GeneralService} generalService
   * @memberof GeneralComponent
   */
  constructor(private generalService: GeneralService) {
    // Preset colours
    this.generalSettings.apperance = {
      accent: "#6e49ff",
      accentHover: "#6e49ff",
      fontColour: "#ffffff"
    };
    this.getGeneralSettings();
  }

  // #region Angular control
  ngOnInit() {}
  // #endregion

  // #region Getters
  /**
   * Get currently stored general settings
   *
   * @private
   * @memberof GeneralComponent
   */
  private getGeneralSettings(): void {
    this.generalService.getGeneralData().then((data: GeneralSettingsData) => {
      if (data) {
        this.generalSettings = data;
      }
    });
  }
  // #endregion

  // #region Setters
  /**
   * Update the stored accent data
   *
   * @memberof GeneralComponent
   */
  public setAccentColours(): void {
    this.generalService.setGeneralData(this.generalSettings);
  }
  // #endregion
}
