<div id="sr-lightbox">
	<article id="sr-image-select">
		<a href="#" title="Close" id="sr-close">X</a><!-- #sr-close -->

		<h1>Select Image</h1>
	
		<form id="sr-form">
			<input type="file" id="sr-new" name="sr_new" value="Select Image" /><!-- #sr-new -->

			<label for="sr-new">Add New Image:</label>
		</form><!-- #sr-form -->

		<ul id="sr-images">
			<?php if( $images ) : ?>
				<?php $i = 0; ?>

				<li>
					<?php foreach( $images as $image ) : ?>
						<div>
							<a href="#" id="sr-delete" title="Delete">x</a>

							<?php if( $image->selected ) : ?>
								<img src="<?= base_url('assets/uploads/') . $image->file; ?>" id="sr-selected" data-img="<?= $image->id; ?>" data-file="<?= $image->file; ?>" />
							<?php else : ?>
								<img src="<?= base_url('assets/uploads/') . $image->file; ?>" data-img="<?= $image->id; ?>" data-file="<?= $image->file; ?>" />
							<?php endif; ?>
						</div>

						<?php if($i % 2 > 0) echo '<li><li>'; ++$i; ?>
					<?php endforeach; ?>

					<?php if( count($images) % 2 > 0 ) : ?>
						<div class="sr-empty"></div>
					<?php endif; ?>
				</li>
			<?php else : ?>
				<p>No Images</p>
			<?php endif; ?>
		</ul><!-- #sr-images -->
	</article><!-- #sr-image-select -->
</div><!-- #sr-lightbox -->