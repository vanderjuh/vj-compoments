import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { VjCarrouselItem } from './classes/vj-carrousel-item.class';

@Component({
  selector: 'vj-carrousel',
  templateUrl: './vj-carrousel.component.html',
  styleUrls: ['./vj-carrousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VjCarrouselComponent {
  @Input() imgs: Array<VjCarrouselItem> = [
    {src: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/1121098-pink-nature-wallpaper-1920x1080-lockscreen.jpg'},
    {src: 'https://www.publicdomainpictures.net/pictures/120000/nahled/nature-wallpaper-1425965180Bbq.jpg'},
    {src: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Amazing_River_Flowing_Nature_Wallpapers.jpg'},
    {src: 'https://www.hdwallpapers.net/previews/gornergletscher-at-night-1167.jpg'},
    {src: 'https://www.publicdomainpictures.net/pictures/90000/nahled/sepia-nature-wallpaper.jpg'}
  ];
}
